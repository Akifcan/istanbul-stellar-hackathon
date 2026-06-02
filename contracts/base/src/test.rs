#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, token, Address, Env};

#[test]
fn deposit_and_payout() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let advertiser = Address::generate(&env);
    let vault = Address::generate(&env);

    let sac = env.register_stellar_asset_contract_v2(admin.clone());
    let token_address = sac.address();
    let mint = token::StellarAssetClient::new(&env, &token_address);
    let token = token::Client::new(&env, &token_address);

    let base_id = env.register(Base, (admin.clone(), token_address.clone()));
    let base = BaseClient::new(&env, &base_id);

    // Advertiser deposits a 1000 budget into the pool.
    mint.mint(&advertiser, &1000);
    base.deposit(&advertiser, &1000);
    assert_eq!(base.balance(), 1000);
    assert_eq!(token.balance(&advertiser), 0);

    // Admin pays out 300 to a publisher vault.
    base.payout(&vault, &300);
    assert_eq!(base.balance(), 700);
    assert_eq!(token.balance(&vault), 300);
}

#[test]
fn getters() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let sac = env.register_stellar_asset_contract_v2(admin.clone());
    let token_address = sac.address();
    let base_id = env.register(Base, (admin.clone(), token_address.clone()));
    let base = BaseClient::new(&env, &base_id);
    assert_eq!(base.admin(), admin);
    assert_eq!(base.token(), token_address);
}
