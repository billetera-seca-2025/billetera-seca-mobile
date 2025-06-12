class HomeScreen {
    get balanceAmount() {
        return $('~balance-amount');
    }

    get transferButton() {
        return $('~transfer-button');
    }

    get addMoneyButton() {
        return $('~add-money-button');
    }

    get debinButton() {
        return $('~debin-button');
    }

    get transactionsButton() {
        return $('~transactions-button');
    }

    get logoutButton() {
        return $('~logout-button');
    }

    async getBalance() {
        const balanceText = await this.balanceAmount.getText();
        return parseFloat(balanceText.replace(/[^0-9.-]+/g, ''));
    }

    async goToTransfer() {
        await this.transferButton.click();
    }

    async goToAddMoney() {
        await this.addMoneyButton.click();
    }

    async goToDebin() {
        await this.debinButton.click();
    }

    async goToTransactions() {
        await this.transactionsButton.click();
    }

    async logout() {
        await this.logoutButton.click();
    }
}

module.exports = new HomeScreen(); 