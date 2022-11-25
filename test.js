client.on('interactionCreate', async interaction => {

	db.all('SELECT * FROM betting', async (err, data) => {
		let info_find = data.map(v => { 
			if(v.id === interaction.user.id) {
				return v
			}
		})
		let info = info_find.filter((element, i) => element !== undefined);
		db.all('SELECT * FROM User', async (err, dataa) => {
			let user_finds = dataa.some(v => v.id === interaction.user.id)
			let user_find = dataa.map(v => { 
				if(v.id === interaction.user.id) {
					return v
				}
			})
			let users = user_find.filter((element, i) => element !== undefined);
			if(user_finds === false) {
				return interaction.reply({ content: `가입 후 이용 해주세요`, ephemeral: true})
			}

			if (interaction.customId === 'Player2') {
				if (Number(users[0].money) >= Number(users[0].betting_amount)) {
					let ID = `${interaction.user.id}`
					if (ID in player) {
						client.users.fetch(interaction.user.id).then(user => { 
							let find = data.some(v => v.id === interaction.user.id)
							if(find === true) {
								if(info[0].value != 'player') {
									return interaction.reply({ content: `이미 ${info[0].value}에 배팅 하셨습니다`, ephemeral: true})
								}
								db.run(`UPDATE betting SET money = ? WHERE id = ?`, [`${Number(info[0].money) + Number(users[0].betting_amount)}`, `${ID}`])
								db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) - Number(users[0].betting_amount)}`, `${ID}`])
							} else if(find === false) {
								db.run(`INSERT INTO betting (id, money, value) VALUES (?, ?, ?)`, [`${interaction.user.id}`, Number(users[0].betting_amount),`player`])
								db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) - Number(users[0].betting_amount)}`, `${ID}`])
							}
							let betting_m = 0
							for(var i = 0; i < info.length; i++) {
								betting_m += info[i].money 
							}
							interaction.reply({ content: `${user} 🔵현재베팅액 : ${Number(betting_m) + Number(users[0].betting_amount)} | 현재잔고 : ${Number(users[0].money) - Number(users[0].betting_amount)}원`, ephemeral: true})
						})
					} else {
						client.users.fetch(interaction.user.id).then(user => { 
							let find = data.some(v => v.id === interaction.user.id)
							if(find === true) {
								if(info[0].value != 'player') {
									return interaction.reply({ content: `이미 ${info[0].value}에 배팅 하셨습니다`, ephemeral: true})
								}
								db.run(`UPDATE betting SET money = ? WHERE id = ?`, [`${Number(info[0].money) + Number(users[0].betting_amount)}`, `${ID}`])
								db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) - Number(users[0].betting_amount)}`, `${ID}`])
							} else if(find === false) {
								db.run(`INSERT INTO betting (id, money, value) VALUES (?, ?, ?)`, [`${interaction.user.id}`, Number(users[0].betting_amount),`player`])
								db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) - Number(users[0].betting_amount)}`, `${ID}`])
							}
							let betting_m = 0
							for(var i = 0; i < info.length; i++) {
								betting_m += info[i].money 
							}
							interaction.reply({ content: `${user} 🔵현재베팅액 : ${Number(betting_m) + Number(users[0].betting_amount)} | 현재잔고 : ${Number(users[0].money) - Number(users[0].betting_amount)}원`, ephemeral: true})
						})
					}
				} else {
					client.users.fetch(interaction.user.id).then(user => { 
						interaction.reply({ content: `${user} 잔고부족입니다.`, ephemeral: true})
					})
				}
			}
			if (interaction.customId === 'Banker2') {
				if (Number(users[0].money) >= Number(users[0].betting_amount)) {
					let ID = `${interaction.user.id}`
					if (ID in banker) {
						client.users.fetch(interaction.user.id).then(user => { 
							let find = data.some(v => v.id === interaction.user.id)
							if(find === true) {
								if(info[0].value != 'banker') {
									return interaction.reply({ content: `이미 ${info[0].value}에 배팅 하셨습니다`, ephemeral: true})
								}
								db.run(`UPDATE betting SET money = ? WHERE id = ?`, [`${Number(info[0].money) + Number(users[0].betting_amount)}`, `${ID}`])
								db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) - Number(users[0].betting_amount)}`, `${ID}`])
							} else if(find === false) {
								db.run(`INSERT INTO betting (id, money, value) VALUES (?, ?, ?)`, [`${interaction.user.id}`, Number(users[0].betting_amount),`banker`])
								db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) - Number(users[0].betting_amount)}`, `${ID}`])
							}
							let betting_m = 0
							for(var i = 0; i < info.length; i++) {
								betting_m += info[i].money 
							}
							interaction.reply({ content: `${user} 🔴현재베팅액 : ${Number(betting_m) + Number(users[0].betting_amount)} | 현재잔고 : ${Number(users[0].money) - Number(users[0].betting_amount)}원`, ephemeral: true})
						})
					} else {
						client.users.fetch(interaction.user.id).then(user => { 
							let find = data.some(v => v.id === interaction.user.id)
							if(find === true) {
								if(info[0].value != 'banker') {
									return interaction.reply({ content: `이미 ${info[0].value}에 배팅 하셨습니다`, ephemeral: true})
								}
								db.run(`UPDATE betting SET money = ? WHERE id = ?`, [`${Number(info[0].money) + Number(users[0].betting_amount)}`, `${ID}`])
								db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) - Number(users[0].betting_amount)}`, `${ID}`])
							} else if(find === false) {
								db.run(`INSERT INTO betting (id, money, value) VALUES (?, ?, ?)`, [`${interaction.user.id}`, Number(users[0].betting_amount),`banker`])
								db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) - Number(users[0].betting_amount)}`, `${ID}`])
							}
							let betting_m = 0
							for(var i = 0; i < info.length; i++) {
								betting_m += info[i].money 
							}
							interaction.reply({ content: `${user} 🔴현재베팅액 : ${Number(betting_m) + Number(users[0].betting_amount)} | 현재잔고 : ${Number(users[0].money) - Number(users[0].betting_amount)}원`, ephemeral: true})
						})
					}
				} else {
					client.users.fetch(interaction.user.id).then(user => { 
						interaction.reply({ content: `${user} 잔고부족입니다.`, ephemeral: true})
					})
				}
			}
			if (interaction.customId === 'Tai2') {
				if (Number(users[0].money) >= Number(users[0].betting_amount)) {
					let ID = `${interaction.user.id}`
					if (ID in tai) {
						client.users.fetch(interaction.user.id).then(user => { 
							let find = data.some(v => v.id === interaction.user.id)
							if(find === true) {
								if(info[0].value != 'tai') {
									return interaction.reply({ content: `이미 ${info[0].value}에 배팅 하셨습니다`, ephemeral: true})
								}
								db.run(`UPDATE betting SET money = ? WHERE id = ?`, [`${Number(info[0].money) + Number(users[0].betting_amount)}`, `${ID}`])
								db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) - Number(users[0].betting_amount)}`, `${ID}`])
							} else if(find === false) {
								db.run(`INSERT INTO betting (id, money, value) VALUES (?, ?, ?)`, [`${interaction.user.id}`, Number(users[0].betting_amount),`tai`])
								db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) - Number(users[0].betting_amount)}`, `${ID}`])
							}
							let betting_m = 0
							for(var i = 0; i < info.length; i++) {
								betting_m += info[i].money 
							}
							interaction.reply({ content: `${user} 🟢현재베팅액 : ${Number(betting_m) + Number(users[0].betting_amount)} | 현재잔고 : ${Number(users[0].money) - Number(users[0].betting_amount)}원`, ephemeral: true})
						})
					} else {
						client.users.fetch(interaction.user.id).then(user => { 
							let find = data.some(v => v.id === interaction.user.id)
							if(find === true) {
								if(info[0].value != 'tai') {
									return interaction.reply({ content: `이미 ${info[0].value}에 배팅 하셨습니다`, ephemeral: true})
								}
								db.run(`UPDATE betting SET money = ? WHERE id = ?`, [`${Number(info[0].money) + Number(users[0].betting_amount)}`, `${ID}`])
								db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) - Number(users[0].betting_amount)}`, `${ID}`])
							} else if(find === false) {
								db.run(`INSERT INTO betting (id, money, value) VALUES (?, ?, ?)`, [`${interaction.user.id}`, Number(users[0].betting_amount),`tai`])
								db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) - Number(users[0].betting_amount)}`, `${ID}`])
							}
							let betting_m = 0
							for(var i = 0; i < info.length; i++) {
								betting_m += info[i].money 
							}
							interaction.reply({ content: `${user} 🟢현재베팅액 : ${Number(betting_m) + Number(users[0].betting_amount)} | 현재잔고 : ${Number(users[0].money) - Number(users[0].betting_amount)}원`, ephemeral: true})
						})
					}
				} else {
					client.users.fetch(interaction.user.id).then(user => { 
						interaction.reply({ content: `${user} 잔고부족입니다.`, ephemeral: true})
					})
				}
			}
			if(interaction.customId === "Info") {
				if(!users[0]) {
					return interaction.reply({ content: "해당 유저의 정보가 없습니다", ephemeral: true})
				}
				let embed = new EmbedBuilder()
				.setTitle(`**${interaction.user.username}** 님의 정보`)
				.addFields({
					name: "돈", 
					value: `${users[0].money}`
				})
				interaction.reply({embeds: [embed],  ephemeral: true})
			}
			if(interaction.customId === "setting") {
				if(!users[0]) {
					return interaction.reply({ content: "해당 유저의 정보가 없습니다", ephemeral: true})
				}

				const modal = new ModalBuilder()
				.setCustomId('setting')
				.setTitle('설정');

				const amount = new TextInputBuilder()
				.setCustomId('amount')
				.setLabel("얼마 씩 배팅하고 싶으십니까?")
				.setStyle(TextInputStyle.Short);

				const firstActionRow = new ActionRowBuilder().addComponents(amount);
				modal.addComponents(firstActionRow);
				await interaction.showModal(modal);
			}
		})
	})
})