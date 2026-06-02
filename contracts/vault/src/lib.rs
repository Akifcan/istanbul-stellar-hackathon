#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Owner,
    Token,
    Admin,
}

#[contract]
pub struct Vault;

#[contractimpl]
impl Vault {
    /// Per-API-key vault. `owner` (publisher) can withdraw; `admin` (AdProof
    /// treasury/backend) funds it. `token` is the SAC token held (e.g. USDC).
    pub fn __constructor(env: Env, owner: Address, token: Address, admin: Address) {
        env.storage().instance().set(&DataKey::Owner, &owner);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Admin moves `amount` of the token from its own balance into this vault.
    pub fn fund(env: Env, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        if amount <= 0 {
            panic!("invalid amount");
        }
        let token: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        token::Client::new(&env, &token).transfer(
            &admin,
            &env.current_contract_address(),
            &amount,
        );
        env.storage().instance().extend_ttl(100, 518400);
    }

    /// Owner withdraws `amount` from the vault to their own address.
    pub fn withdraw(env: Env, amount: i128) {
        let owner: Address = env.storage().instance().get(&DataKey::Owner).unwrap();
        owner.require_auth();
        if amount <= 0 {
            panic!("invalid amount");
        }
        let token: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        token::Client::new(&env, &token).transfer(
            &env.current_contract_address(),
            &owner,
            &amount,
        );
        env.storage().instance().extend_ttl(100, 518400);
    }

    pub fn balance(env: Env) -> i128 {
        let token: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        token::Client::new(&env, &token).balance(&env.current_contract_address())
    }

    pub fn owner(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Owner).unwrap()
    }

    pub fn token(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Token).unwrap()
    }

    pub fn admin(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Admin).unwrap()
    }
}

mod test;
