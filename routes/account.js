import express from "express";

import { checkAuth } from "../middlewares/checkAuth.js";
import * as AccountController from "../controllers/account.js";
import { mapAccount } from "../utils/mapAccount.js";
import { checkAccountsLimit } from "../middlewares/checkAccountsLimit.js";

const accountRouter = express.Router({ mergeParams: true });

let accountCounter = 0;

accountRouter.post(
    "/",
    checkAuth,
    checkAccountsLimit(accountCounter),
    async (req, res) => {
        try {
            const data = {
                title: req.body.title,
                amount: req.body.initialAmount,
                initialAmount: req.body.initialAmount,
                image_url: req.body.image_url
                    ? req.body.image_url
                    : "https://www.svgrepo.com/show/438323/bank-account.svg",
                user: req.user.id,
            };

            const account = await AccountController.addAccount(data);

            res.send({
                error: null,
                account: mapAccount(account),
            });
        } catch (error) {
            console.log("error :>> ", error);

            res.send({
                error:
                    error.code === 11000
                        ? "Account already exists"
                        : error.message,
                account: null,
            });
        }
    }
);

accountRouter.get("/", checkAuth, async (req, res) => {
    try {
        const accounts = await AccountController.getAll(
            req.user.id,
            req.query.records
        );

        res.send({
            error: null,
            accounts: accounts.map((account) =>
                mapAccount(account, req.query.records)
            ),
        });
    } catch (error) {
        console.log("error :>> ", error);

        res.send({
            error: error.message,
            accounts: null,
        });
    }
});

accountRouter.get("/:id", checkAuth, async (req, res) => {
    try {
        const account = await AccountController.getOne(req.params.id);

        res.send({
            error: null,
            account: mapAccount(account),
        });
    } catch (error) {
        console.log("error :>> ", error);
        res.send({
            error: error.message,
            account: null,
        });
    }
});

accountRouter.delete("/:id", checkAuth, async (req, res) => {
    try {
        await AccountController.deleteOne(req.params.id);

        res.send({
            error: null,
            success: true,
        });
    } catch (error) {
        console.log("error :>> ", error);
        res.send({
            error: error.message,
            account: null,
        });
    }
});

export default accountRouter;
