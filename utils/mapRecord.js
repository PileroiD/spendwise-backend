export const mapRecord = (record) => {
    return {
        id: record._id,
        userId: record.user_id,
        accountId: record.account_id,
        accountName: record.account_name,
        title: record.title,
        type: record.type,
        amount: record.amount,
        description: record.description,
        imageUrl: record.image_url,
        createdAt: record.createdAt,
    };
};
