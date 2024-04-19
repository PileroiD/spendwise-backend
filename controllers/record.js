import RecordModel from "../models/Record.js";
import AccountModel from "../models/Account.js";

const updateAccountAmount = async (accountId) => {
    const totalAmountResult = await RecordModel.find({
        account_id: accountId,
    });

    const totalAmount =
        totalAmountResult.length &&
        totalAmountResult
            .map((record) => record.amount)
            .reduce((acc, amount) => acc + amount);

    const account = await AccountModel.findById(accountId);

    if (account) {
        const updatedAmount = account.initialAmount + totalAmount || 0;

        const updateQuery = {
            $set: {
                amount: updatedAmount,
            },
        };

        await AccountModel.findOneAndUpdate({ _id: accountId }, updateQuery);
    }
};

export const addRecord = async (data) => {
    const newRecord = await RecordModel.create(data);

    await AccountModel.findOneAndUpdate(
        { _id: data.account_id },
        { $push: { records: newRecord } }
    );

    await updateAccountAmount(data.account_id);

    return newRecord;
};

export const getRecords = async (userId, recordType, search, limit, page) => {
    const findSettings = { user_id: userId };

    if (recordType) {
        findSettings.type = recordType;
    }

    if (search) {
        findSettings.title = { $regex: search, $options: "i" };
    }

    const query = RecordModel.find(findSettings).sort({ createdAt: -1 });

    if (limit) {
        query.limit(limit);
    }

    if (limit && page) {
        query.skip((page - 1) * limit).limit(limit);
    }

    const records = await query.exec();

    const amountOfRecords = await RecordModel.countDocuments(findSettings);
    const amountOfPages = limit ? Math.ceil(amountOfRecords / limit) : 1;

    return {
        records,
        lastPage: amountOfPages,
    };
};

export const getOne = async (recordId) => {
    const record = await RecordModel.findById(recordId);
    if (!record) {
        throw new Error("Record not found");
    }

    return record;
};

export const editOne = async (recordId, newData) => {
    const prevRecordInfo = await RecordModel.findById(recordId);

    const record = await RecordModel.findByIdAndUpdate(
        { _id: recordId },
        newData,
        {
            returnDocument: "after",
        }
    );

    if (newData.account_name !== prevRecordInfo.account_name) {
        await Promise.all([
            AccountModel.findOneAndUpdate(
                { _id: prevRecordInfo.account_id },
                { $pull: { records: recordId } }
            ),
            AccountModel.findOneAndUpdate(
                { _id: newData.account_id },
                { $push: { records: record } }
            ),
        ]);
    }

    await Promise.all([
        updateAccountAmount(newData.account_id),
        updateAccountAmount(prevRecordInfo.account_id),
    ]);

    return record;
};

export const deleteOne = async (recordId) => {
    const record = await RecordModel.findById(recordId);
    if (!record) {
        throw new Error("Record not found");
    }

    await RecordModel.findByIdAndDelete(recordId);

    await AccountModel.findOneAndUpdate(
        { _id: record.account_id },
        {
            $pull: { records: recordId },
        }
    );

    await updateAccountAmount(record.account_id);
};
