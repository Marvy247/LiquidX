;; LiquidX Rewards Contract
;; Tracks bridge positions and distributes $LQX rewards

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-claimed (err u102))
(define-constant err-insufficient-rewards (err u103))
(define-constant err-invalid-amount (err u104))

;; $LQX Token name
(define-constant LQX_TOKEN_NAME "LiquidX")
(define-constant LQX_TOKEN_SYMBOL "LQX")

;; Reward multipliers (basis points, 10000 = 1x)
(define-constant MULTIPLIER_TIER_1 u10000)  ;; 1x: < 1,000 USDCx
(define-constant MULTIPLIER_TIER_2 u15000)  ;; 1.5x: 1,000 - 10,000 USDCx
(define-constant MULTIPLIER_TIER_3 u20000)  ;; 2x: 10,000 - 50,000 USDCx
(define-constant MULTIPLIER_TIER_4 u30000)  ;; 3x: > 50,000 USDCx

;; Bridge positions tracking
(define-map bridge-positions
  { user: principal }
  {
    total-bridged: uint,              ;; Total USDCx bridged from Ethereum
    bridge-timestamp: uint,           ;; First bridge time
    reward-multiplier: uint,          ;; Current multiplier (basis points)
    unclaimed-rewards: uint,          ;; $LQX tokens earned but not claimed
    last-claim: uint,                 ;; Last claim timestamp
    auto-deployed: bool,              ;; Whether auto-deployed to DeFi
    target-protocol: (string-ascii 50), ;; Target DeFi protocol
    total-earned: uint,               ;; Lifetime earnings
    referrer: (optional principal)    ;; Who referred this user
  }
)

;; Leaderboard tracking (top 100)
(define-map liquidity-leaderboard
  { rank: uint }
  { 
    user: principal,
    amount-bridged: uint,
    total-rewards: uint
  }
)

;; Total stats
(define-data-var total-liquidity-bridged uint u0)
(define-data-var total-rewards-distributed uint u0)
(define-data-var total-users uint u0)

;; Protocol deployment targets
(define-map approved-protocols
  { protocol-name: (string-ascii 50) }
  {
    contract-address: principal,
    min-apy: uint,                    ;; Minimum APY (basis points)
    risk-score: uint,                 ;; 1-10 risk rating
    tvl: uint,                        ;; Total value locked
    active: bool
  }
)

;; Register a bridge transaction
;; Called when user bridges USDC from Ethereum
(define-public (register-bridge
    (user principal)
    (amount uint)
    (eth-tx-hash (buff 32))
    (auto-deploy bool)
    (target-protocol (string-ascii 50))
    (referrer (optional principal)))
  (let
    (
      (existing-position (default-to 
        {
          total-bridged: u0,
          bridge-timestamp: block-height,
          reward-multiplier: MULTIPLIER_TIER_1,
          unclaimed-rewards: u0,
          last-claim: block-height,
          auto-deployed: false,
          target-protocol: "",
          total-earned: u0,
          referrer: none
        }
        (map-get? bridge-positions { user: user })))
      (new-total (+ (get total-bridged existing-position) amount))
      (new-multiplier (calculate-multiplier new-total))
      (base-rewards (calculate-rewards amount))
      (bonus-rewards (if auto-deploy (/ (* base-rewards u30) u100) u0)) ;; 30% bonus for auto-deploy
      (total-rewards (+ base-rewards bonus-rewards))
    )
    ;; Update position
    (map-set bridge-positions
      { user: user }
      {
        total-bridged: new-total,
        bridge-timestamp: (get bridge-timestamp existing-position),
        reward-multiplier: new-multiplier,
        unclaimed-rewards: (+ (get unclaimed-rewards existing-position) total-rewards),
        last-claim: (get last-claim existing-position),
        auto-deployed: auto-deploy,
        target-protocol: target-protocol,
        total-earned: (+ (get total-earned existing-position) total-rewards),
        referrer: referrer
      }
    )
    
    ;; Update global stats
    (var-set total-liquidity-bridged (+ (var-get total-liquidity-bridged) amount))
    (var-set total-rewards-distributed (+ (var-get total-rewards-distributed) total-rewards))
    
    ;; If first bridge, increment user count
    (if (is-eq (get total-bridged existing-position) u0)
      (var-set total-users (+ (var-get total-users) u1))
      true
    )
    
    ;; Update leaderboard (simplified - always succeeds)
    (begin
      (update-leaderboard user new-total total-rewards)
      
      ;; Reward referrer if exists - unwrap or ignore error
      (match referrer
        referrer-address 
          (unwrap-panic (reward-referrer referrer-address total-rewards))
        u0
      )
      
      (ok {
        rewards-earned: total-rewards,
        new-multiplier: new-multiplier,
        total-bridged: new-total
      })
    )
  )
)

;; Calculate rewards based on amount bridged
(define-private (calculate-rewards (amount uint))
  ;; Base: 0.75% of bridged amount as $LQX rewards
  ;; This incentivizes larger bridges
  (/ (* amount u75) u10000)
)

;; Calculate multiplier tier based on total bridged
(define-private (calculate-multiplier (total-amount uint))
  (if (>= total-amount u50000000000) ;; > 50,000 USDCx (6 decimals)
    MULTIPLIER_TIER_4
    (if (>= total-amount u10000000000) ;; > 10,000 USDCx
      MULTIPLIER_TIER_3
      (if (>= total-amount u1000000000) ;; > 1,000 USDCx
        MULTIPLIER_TIER_2
        MULTIPLIER_TIER_1
      )
    )
  )
)

;; Claim accumulated rewards
(define-public (claim-rewards)
  (let
    (
      (position (unwrap! (map-get? bridge-positions { user: tx-sender }) err-not-found))
      (claimable (get unclaimed-rewards position))
    )
    (asserts! (> claimable u0) err-insufficient-rewards)
    
    ;; Update position
    (map-set bridge-positions
      { user: tx-sender }
      (merge position {
        unclaimed-rewards: u0,
        last-claim: block-height
      })
    )
    
    ;; Transfer $LQX tokens (placeholder - would mint/transfer actual tokens)
    ;; In production, this would call a SIP-010 token contract
    
    (ok claimable)
  )
)

;; Update leaderboard with new position
(define-private (update-leaderboard (user principal) (amount uint) (rewards uint))
  ;; Simplified leaderboard logic
  ;; In production, this would properly sort and maintain top 100
  true
)

;; Reward referrer (10% of referred user's rewards)
(define-private (reward-referrer (referrer principal) (base-rewards uint))
  (let
    (
      (referrer-position-opt (map-get? bridge-positions { user: referrer }))
      (referral-bonus (/ (* base-rewards u10) u100)) ;; 10% bonus
    )
    (match referrer-position-opt
      referrer-position
        (begin
          (map-set bridge-positions
            { user: referrer }
            (merge referrer-position {
              unclaimed-rewards: (+ (get unclaimed-rewards referrer-position) referral-bonus),
              total-earned: (+ (get total-earned referrer-position) referral-bonus)
            })
          )
          (ok referral-bonus)
        )
      (ok u0)
    )
  )
)

;; Get user position
(define-read-only (get-user-position (user principal))
  (ok (map-get? bridge-positions { user: user }))
)

;; Get global stats
(define-read-only (get-global-stats)
  (ok {
    total-liquidity-bridged: (var-get total-liquidity-bridged),
    total-rewards-distributed: (var-get total-rewards-distributed),
    total-users: (var-get total-users)
  })
)

;; Get leaderboard entry
(define-read-only (get-leaderboard-rank (rank uint))
  (ok (map-get? liquidity-leaderboard { rank: rank }))
)

;; Register approved DeFi protocol
(define-public (register-protocol
    (protocol-name (string-ascii 50))
    (contract-address principal)
    (min-apy uint)
    (risk-score uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set approved-protocols
      { protocol-name: protocol-name }
      {
        contract-address: contract-address,
        min-apy: min-apy,
        risk-score: risk-score,
        tvl: u0,
        active: true
      }
    ))
  )
)

;; Get protocol info
(define-read-only (get-protocol (protocol-name (string-ascii 50)))
  (ok (map-get? approved-protocols { protocol-name: protocol-name }))
)
