export const checkAccountsLimit = (accountCounter) => (req, res, next) => {
    if (accountCounter >= 10) {
        return res.status(400).json({
            error: `You cannot create more than 10 accounts`,
        });
    }

    accountCounter++;
    next();
};
