module.exports = (r, userID, amount) => {
	return new Promise((resolve, reject) => {
		r.table('balance').get(userID).run((error, balance) => {
			if (error) return reject(error);
			if (balance) {
				r.table('balance').get(userID).update({
					amount: balance.amount + amount
				}).run((error) => {
					if (error) return reject(error);
					resolve(balance.amount + amount);
				});
			} else {
				r.table('balance').insert({
					id: userID,
					amount
				}).run((error) => {
					if (error) return reject(error);
					resolve(amount);
				});
			}
		});
	});
};