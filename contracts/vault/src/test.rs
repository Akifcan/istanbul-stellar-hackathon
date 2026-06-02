#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, token, Address, Env};

fn setup() -> (Env, Address, Address, Address, VaultClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();

    let owner = Address::generate(&env);
    let admin = Address::generate(&env);

    // Mock USDC (SAC).
    let sac = env.register_stellar_asset_contract_v2(admin.clone());
    let token_address = sac.address();

    let vault_id = env.register(
        Vault,
        (owner.clone(), token_address.clone(), admin.clone()),
    );
    let vault = VaultClient::new(&env, &vault_id);

    (env, owner, admin, token_address, vault)
}

#[test]
fn fund_and_withdraw() {
    let (env, owner, admin, token_address, vault) = setup();

    let mint = token::StellarAssetClient::new(&env, &token_address);
    let token = token::Client::new(&env, &token_address);

    // Admin holds 1000, funds the vault with 600.
    mint.mint(&admin, &1000);
    vault.fund(&600);
    assert_eq!(vault.balance(), 600);
    assert_eq!(token.balance(&admin), 400);

    // Owner withdraws 250 to their own wallet.
    vault.withdraw(&250);
    assert_eq!(vault.balance(), 350);
    assert_eq!(token.balance(&owner), 250);
}

#[test]
fn getters() {
    let (_env, owner, admin, token_address, vault) = setup();
    assert_eq!(vault.owner(), owner);
    assert_eq!(vault.admin(), admin);
    assert_eq!(vault.token(), token_address);
}
