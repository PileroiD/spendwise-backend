import moment from "moment";

import AccountModel from "../models/Account.js";
import RecordModel from "../models/Record.js";

export const addAccount = async (data) => {
    const account = await AccountModel.create(data);
    await account.populate("user");

    return account;
};

export const getAll = async (userId, isRecordsNeeded) => {
    const lastThirtyDays = moment().subtract(30, "days").toDate();

    const accounts = await AccountModel.find({
        user: userId,
    }).populate(["user", "records"]);

    const accountsWithRecords = [];

    for (const account of accounts) {
        let records = [];

        if (isRecordsNeeded === "true") {
            records = await RecordModel.find({
                account_id: account._id,
                createdAt: { $gte: lastThirtyDays },
            });
        }

        accountsWithRecords.push({ ...account.toJSON(), records });
    }

    return accounts;
};

export const getOne = async (accountId) => {
    const account = await AccountModel.findById(accountId);
    await account.populate(["user", "records"]);

    return account;
};

export const deleteOne = async (accountId) => {
    const account = await AccountModel.findById(accountId);
    if (!account) {
        throw new Error("Account not found");
    }

    await AccountModel.findByIdAndDelete(accountId);

    await RecordModel.deleteMany({
        account_id: accountId,
    });
};
