function paginateQuery(query, totalCount, page, limit){
    query += ` LIMIT ${limit}`;

    const offset = (limit * (page - 1));

    if(offset >= totalCount){
        throw new Error("Pagination error");
    }

    if(offset){
        query += ` OFFSET ${offset}`
    }

    return query;
}

module.exports = {
    paginateQuery,
}