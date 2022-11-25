const { token, PREFIX } = require('./config.json');
const fs = require('fs')
const { Client, GatewayIntentBits, Partials  } = require('discord.js');
const { 
	EmbedBuilder, 
	ActionRowBuilder, 
	ButtonBuilder, 
	AttachmentBuilder, 
	ModalBuilder, 
	TextInputBuilder, 
	TextInputStyle, 
	InteractionType
} = require('discord.js')
const Canvas = require('@napi-rs/canvas');
const { join } = require('path')
const client = new Client({  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});
var sqlite3 = require('sqlite3').verbose();
var dbPath = `${__dirname}/db.db`;
let db = new sqlite3.Database(dbPath/*dbPath*/, sqlite3.OPEN_READWRITE, (err) => {
    try {
        if (err) {
            console.error(err.message);
        } else {
            console.log('DB 를 성공적으로 연결 하였습니다!');

        }
    } catch(err) {
        console.log(err)
    }
}); 
// db.get(`SELECT name FROM sqlite_master WHERE trpe='table' AND name=?`, 'Lic', (err, row) => {
//         if(row === undefined) {
//             try {
//                 db.run('CREATE TABLE Lic (id, amount)') // 테이블 생성
//                 console.log("Lic 테이블 생성")
//             } catch(err) {         
//             }
//         }
// })
// db.get(`SELECT name FROM sqlite_master WHERE trpe='table' AND name=?`, 'User', (err, row) => {
//         if(row === undefined) {
//             try {
//                 db.run('CREATE TABLE User (id, money, waring, betting_amount)') // 테이블 생성
//                 console.log("User 테이블 생성")
//             } catch(err) {         
//             }
//         }
// })
// db.get(`SELECT name FROM sqlite_master WHERE trpe='table' AND name=?`, 'betting_log', (err, row) => {
//         if(row === undefined) {
//             try {
//                 db.run('CREATE TABLE betting_log (id, money, time)') // 테이블 생성
//                 console.log("betting_log 테이블 생성")
//             } catch(err) {         
//             }
//         }
// })
// db.get(`SELECT name FROM sqlite_master WHERE trpe='table' AND name=?`, 'Game', (err, row) => {
//         if(row === undefined) {
//             try {
//                 db.run('CREATE TABLE Game (runtime)') // 테이블 생성
//                 console.log("Game 테이블 생성")
//             } catch(err) {         
//             }
//         }
// })
// db.get(`SELECT name FROM sqlite_master WHERE trpe='table' AND name=?`, 'betting', (err, row) => {
//         if(row === undefined) {
//             try {
//                 db.run('CREATE TABLE betting (id, money, value)') // 테이블 생성
//                 console.log("betting 테이블 생성")
//             } catch(err) {         
//             }
//         }
// })



client.login(token);

let money = {}
let history = {}
let player = {}
let banker = {}
let tai = {}
let bakaratype = 'off'
let ing = 'on'
let time = 15
let coordinate = 15
let Perpendicular = 20
let line = 1
let timemessage
let cardorder = 1
let channel
let resultmessage
let bettingmessage
let picture = ''
let card = {
	"card1" : 0,
	"card2" : 0,
	"card3" : 0,
	"card4" : 0
}

module.exports.run = async (Client, message, args, prefix) => {
	const embed = new EmbedBuilder()
	.setTitle('test')
	.setColor(0x0078FF)

	const yes = new MessageButton()
	.setStyle('green')
	.setLabel('Yes')
	.setID('test')
	message.channel.send('', {
		buttons: [yes],
		embed : embed
	})
}

client.once('ready', async () => {
	const canvas = Canvas.createCanvas(700, 250);
	const context = canvas.getContext('2d');

	const background = await Canvas.loadImage('./img/background.png');
	context.drawImage(background, 0, 0, canvas.width, canvas.height);
	const b = canvas.toBuffer('image/png')
	fs.writeFileSync(join('./img/current', 'current.png'), b)
	console.log('접속성공!')
})

client.on('interactionCreate', int => {
	if (!int.isCommand) return

	try {
		if(int.commandName === "가입") {
			db.all('SELECT * FROM User', async (err, data) => {
				try {
					let find = data.some(v => v.id === int.user.id)
					if(find === true) {
						int.reply({content: "이미 가입 된 유저 입니다"})
					} else if(find === false) {
						db.run(`INSERT INTO User (id, money, waring, betting_amount) VALUES (?, ?, ?, ?)`, [int.user.id, 0, 0, 1000])
						let embed = new EmbedBuilder()
						.setTitle("가입")
						.setColor(0x00F01C)
						.setDescription("정상적으로 가입 되었습니다.")
						int.reply({embeds: [embed]})
					}
				}catch(err) {

				}
			})
		}
		if(int.commandName === "정보") {
			let value = int.options.getString("대상");
			db.all('SELECT * FROM User', async (err, data) => {
					let info_find = data.map(v => { 
						if(v.id === int.user.id) {
							return v
						}
					})
					let info = info_find.filter((element, i) => element !== undefined);
					let find = data.some(v => v.id === int.user.id)
					if(find === false) {
						return int.reply("가입 후 이용 해주세요")
					}
				if(!value) {
					let embed = new EmbedBuilder()
					.setTitle(`${int.user.username} 님의 정보`)
					.addFields({
						name: "돈", 
						value: `${info[0].money}`
					})
					return int.reply({embeds: [embed]})
				} else {
					let ID = `${value.slice(3, -1)}`
					let info_find = data.map(v => { 
						if(v.id === ID) {
							return v
						}
					})
					let info = info_find.filter((element, i) => element !== undefined);
					client.users.fetch(`${ID}`).then((user) => {
						let embed = new EmbedBuilder()
						.setTitle(`${user.username} 님의 정보`)
						.addFields({
							name: "돈", 
							value: `${info[0].money}`
						})
						return int.reply({embeds: [embed]})
					}).catch(console.error);
				}
			})
		}

		if(int.commandName === "충전") {
			let value = int.options.getString("라이센스");
			db.all('SELECT * FROM User', async (err, dataa) => {
				let find = dataa.some(v => v.id === int.user.id)
				if(find === false) {
					return int.reply("가입 후 이용 해주세요")
				}
				db.all('SELECT * FROM Lic', async (err, data) => {
					let info_find = dataa.map(v => { 
						if(v.id === int.user.id) {
							return v
						}
					})
					let info = info_find.filter((element, i) => element !== undefined);
					let finds = data.some(v => v.id === value)
					let ID = `${int.user.id}`
					if(finds === true) {
						let key_find = data.map(v => { 
							if(v.id === value) {
								return v
							}
						})
						let key_set = key_find.filter((element, i) => element !== undefined);
						db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(info[0].money) + Number(key_set[0].amount)}`, `${int.user.id}`])
						int.reply(`${key_set[0].amount} 의 금액을 충전 했습니다\n현재 잔액 : ${Number(info[0].money) + Number(key_set[0].amount)}`)
						db.run(`DELETE FROM Lic WHERE id = ?;`, [`${value}`])
					} else if(finds === false) {
						return int.reply("라이센스를 찾을 수 없습니다")
					}
				})
			})
		}
	} catch(err) {
		console.log(err)
	}
})

client.on('messageCreate', async (message) => {
	// a = msg.channel
	// console.log(msg.channel.id)
	// if (msg.content === '!주사위') {
	// 	let first = Math.floor(Math.random() * 6) + 1;
	// 	let second = Math.floor(Math.random() * 6) + 1;
	// 	let third = Math.floor(Math.random() * 6) + 1;
	// 	msg.reply(`||첫번째 주사위 : ${first}\n두번째 주사위 : ${second}\n 세번째 주사위 : ${third}\n승리하신 분들 축하드립니다.||`)
	// }
	if (message.content[0] !== PREFIX) return;
    
    const request = message.content.substring(1).split(" ")[0];

	if(request === "생성") {
		if (message.author.id === '1044246488462655599' || message.author.id === '845237322194747422') {
			let arguments = message.content.split(' ')
			if(!arguments[1] || isNaN(Number(arguments[1])) === true) {
				return message.reply('몇개를 생성 할지 올바르게 입력하세요')
			}
			if(!arguments[2] || isNaN(Number(arguments[2])) === true) {
				return message.reply('라이센스의 금액을 입력해주세요')
			}
            let list = []
            for(var i = 0; i < Number(arguments[1]); i++) {
                let key = `${Math.random().toString(36).substr(2,11)}`
                db.all('SELECT * FROM Lic', async (err, data) => {
                    db.run(`INSERT INTO Lic (id, amount) VALUES (?, ?)`, [`${key}`, `${arguments[2]}`])
                })
                list.push(key)
            }
            var embeded = new EmbedBuilder()
            .setTitle("✅ Success ✅ ")
            .setColor(0x00F01C)
            .addFields({
				name: "생성된 키", 
				value: "```" + `${list[0]}\n${list.toString().replaceAll(',', '\n')}` + "```"
			})
            return message.reply({ embeds: [embeded] }).catch(console.error);
		}
	}
	if (request === "강제충전") {
		if (message.author.id === '1044246488462655599' || message.author.id === '845237322194747422') {
			db.all('SELECT * FROM User', async (err, dataa) => {
				let arguments = message.content.split(' ')
				let ID = arguments[1]
				let M = arguments[2]
				if(message.mentions.users.first()) {
					ID = message.mentions.users.first().id
				}
				let player_find = dataa.map(v => { 
					if(v.id === ID) {
						return v
					}
				})
				let info = player_find.filter((element, i) => element !== undefined);
				let find = dataa.some(v => v.id === ID)
				if(find === false) {
					return message.reply('가입되지 않은 유저입니다')
				}
				db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(info[0].money) + Number(M)}`, `${ID}`])
				return message.reply('충전완료')
			})
		}
	}
	if (request === "강제차감") {
		if (message.author.id === '1044246488462655599' || message.author.id === '845237322194747422') {
			db.all('SELECT * FROM User', async (err, dataa) => {
				let arguments = message.content.split(' ')
				let ID = arguments[1]
				let M = arguments[2]
				if(message.mentions.users.first()) {
					ID = message.mentions.users.first().id
				}
				let player_find = dataa.map(v => { 
					if(v.id === ID) {
						return v
					}
				})
				let info = player_find.filter((element, i) => element !== undefined);
				let find = dataa.some(v => v.id === ID)
				if(find === false) {
					return message.reply('가입되지 않은 유저입니다')
				}
				db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(info[0].money) - Number(M)}`, `${ID}`])
				return message.reply('차감완료')
			})
		}
	}
	if (message.content.includes('회차') === true  && message.author.id === '1044246488462655599') resultmessage = message.id
	if (message.content.includes('베팅을 하십시오.') === true  && message.author.id === '1044246488462655599') bettingmessage = message
	if (message.content.includes('15초') === true  && message.author.id === '1044246488462655599') timemessage = message.id
	if (request === '시작') {
		if (message.author.id === "1044246488462655599" || message.author.id === "845237322194747422") {
			 bakaratype = 'on'
			 channel = message.channel
			 money['runtime'] = 0
		}
	}
})

let bakaraon = setInterval(async function() {
	if (bakaratype === 'on') {
	if (ing === 'on'){
		db.all('SELECT * FROM Game', async (err, data) => {
			db.all('SELECT * FROM betting', async (err, dataa) => {
				db.all('SELECT * FROM User', async (err, dataaa) => {
					if (line >= 4 && coordinate === 665) {
						const canvas = Canvas.createCanvas(700, 250);
						const context = canvas.getContext('2d');
						Perpendicular = 20
						coordinate = 15
						line = 1
						const background = await Canvas.loadImage('./img/background.png');
						context.drawImage(background, 0, 0, canvas.width, canvas.height);
						const b = canvas.toBuffer('image/png')
						fs.writeFileSync(join('./img/current', 'current.png'), b)
						db.run(`UPDATE Game SET runtime = "1"`)
					}
						card[`card${cardorder}`] = Math.floor(Math.random() * 9) + 0;
						if (cardorder === 1) {
							const embed = new EmbedBuilder()
								.setTitle(`**                    1       /      4        **\n \n \`🔵플레이어  ||  🔴뱅커\`\n \n**          ${card['card1']}   |  ❓   //   ❓   |  ❓\n🔵플레이어 : ${card['card1']}\n🔴뱅커 : 0\n🟢무승부**`)
								.setColor(0xDFDFDF)
							car_msg = await channel.send(`${Number(data[0].runtime)}회차`, {
								embeds: [embed]
							})
							db.run(`UPDATE Game SET runtime = ?`, [`${Number(data[0].runtime) + 1}`])
						}
						if (cardorder === 2) {
							const embed = new EmbedBuilder()
								.setTitle(`**                    2       /      4        **\n \n \`🔵플레이어  ||  🔴뱅커\`\n \n**          ${card['card1']}   |  ❓   //   ${card['card2']}   |  ❓\n🔵플레이어 : ${card['card1']}\n🔴뱅커 : ${card['card2']}\n🟢무승부**`)
								.setColor(0xDFDFDF)
							car_msg2 = await car_msg.edit({embeds: [embed]})
						}
						if (cardorder === 3) {
							let result1
							if (card['card1'] + card['card3'] > 9) result1 = card['card1'] + card['card3'] - 10
							else result1 = card['card1'] + card['card3']
							const embed = new EmbedBuilder()
								.setTitle(`**                    3       /      4        **\n \n \`🔵플레이어  ||  🔴뱅커\`\n \n**          ${card['card1']}   |  ${card['card3']}   //   ${card['card2']}   |  ❓\n🔵플레이어 : ${result1}\n🔴뱅커 : ${card['card2']}\n🟢무승부**`)
								.setColor(0xDFDFDF)
							car_msg3 = await car_msg2.edit({embeds: [embed]})
						}
						if (cardorder === 4) {
							let result1
							let result2
							if (card['card1'] + card['card3'] > 9) result1 = card['card1'] + card['card3'] - 10
							else result1 = card['card1'] + card['card3']
							if (card['card2'] + card['card4'] > 9) result2 = card['card2'] + card['card4'] - 10
							else result2 = card['card2'] + card['card4']
							if (result1 > result2) {
								const embed = new EmbedBuilder()
								.setTitle(`**                    4       /      4        **\n \n \`🔵플레이어  ||  🔴뱅커\`\n \n**          ${card['card1']}   |  ${card['card3']}   //   ${card['card2']}   |  ${card['card4']}\n🔵플레이어 : ${result1}   ✅   < 승리! > X 2배\n🔴뱅커 : ${result2}\n🟢무승부**`)
								.setColor(0x0078FF)
								car_msg4 = await car_msg3.edit({embeds: [embed]})
								let player_find = dataa.map(v => { 
									if(v.value === 'player') {
										return v
									}
								})
								let player = player_find.filter((element, i) => element !== undefined);
								for(var i = 0; i < player.length; i++) {
										let find = dataaa.map(v => { 
											if(v.id === player[i].id) {
												return v
											}
										})
										let users = find.filter((element, i) => element !== undefined);
										db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) + Number(player[i].money)*2}`, `${player[i].id}`])
								}
								db.run(`DELETE FROM betting`)
								if (picture.length === 48) picture = ''
								picture += 'P'

								const canvas = Canvas.createCanvas(700, 250);
								const context = canvas.getContext('2d');

								const background = await Canvas.loadImage('./img/background.png');
								context.drawImage(background, 0, 0, canvas.width, canvas.height);
								// Set the color of the stroke
								context.strokeStyle = '#0099ff';

								// Draw a rectangle with the dimensions of the entire canvas
								context.strokeRect(0, 0, canvas.width, canvas.height);

								let value = picture.replace(/(\s*)/g, "")
								let last = value[value.length - 1];
								if(coordinate === 665) {
									Perpendicular += 50
									coordinate = 15
									line += 1
								}
									if(last === "P"){
										const background = await Canvas.loadImage('./img/current/current.png');
										context.drawImage(background, 0, 0, canvas.width, canvas.height);
										const sub_image = await Canvas.loadImage('./img/player_ball.png');
										context.drawImage(sub_image, coordinate, Perpendicular, 50, 50);
										coordinate += 50
									} else if(last === "B") {
										const background = await Canvas.loadImage('./img/current/current.png');
										context.drawImage(background, 0, 0, canvas.width, canvas.height);
										const sub_image = await Canvas.loadImage('./img/banker_ball.png');
										context.drawImage(sub_image, coordinate, Perpendicular, 50, 50);
										coordinate += 50
									} else if(last === "T") {
										const background = await Canvas.loadImage('./img/current/current.png');
										context.drawImage(background, 0, 0, canvas.width, canvas.height);
										const sub_image = await Canvas.loadImage('./img/tai_ball.png');
										context.drawImage(sub_image, coordinate, Perpendicular, 50, 50);
										coordinate += 50
									}

								const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'image.png' });
								let img_embed = new EmbedBuilder()
								.setTitle(`**                    4       /      4        **\n \n \`🔵플레이어  ||  🔴뱅커\`\n \n**          ${card['card1']}   |  ${card['card3']}   //   ${card['card2']}   |  ${card['card4']}\n🔵플레이어 : ${result1}   ✅   < 승리! > X 2배\n🔴뱅커 : ${result2}\n🟢무승부**`)
								.setColor(0x0078FF)
								.setImage('attachment://image.png')
								car_msg4.edit({embeds: [img_embed],  files: [attachment] })
								const b = canvas.toBuffer('image/png')
								fs.writeFileSync(join('./img/current', 'current.png'), b)
							}
							if (result1 < result2) {
								const embed = new EmbedBuilder()
								.setTitle(`**                    4       /      4        **\n \n \`🔵플레이어  ||  🔴뱅커\`\n \n**          ${card['card1']}   |  ${card['card3']}   //   ${card['card2']}   |  ${card['card4']}\n🔵플레이어 : ${result1}\n🔴뱅커 : ${result2}   ✅   < 승리! > X 1.95배\n🟢무승부**`)
								.setColor(0xFF0000)
								car_msg5 = await car_msg3.edit({embeds: [embed]})
								let banker_find = dataa.map(v => { 
									if(v.value === 'banker') {
										return v
									}
								})
								let banker = banker_find.filter((element, i) => element !== undefined);
								for(var i = 0; i < banker.length; i++) {
										let find = dataaa.map(v => { 
											if(v.id === banker[i].id) {
												return v
											}
										})
										let users = find.filter((element, i) => element !== undefined);
										db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) + Number(banker[i].money)*1.95}`, `${banker[i].id}`])
								}
								db.run(`DELETE FROM betting`)
								if (picture.length === 48) picture = ''
								picture += 'B'

								const canvas = Canvas.createCanvas(700, 250);
								const context = canvas.getContext('2d');

								const background = await Canvas.loadImage('./img/background.png');
								context.drawImage(background, 0, 0, canvas.width, canvas.height);
								// Set the color of the stroke
								context.strokeStyle = '#0099ff';

								// Draw a rectangle with the dimensions of the entire canvas
								context.strokeRect(0, 0, canvas.width, canvas.height);

								let value = picture.replace(/(\s*)/g, "")
								let last = value[value.length - 1];
								if(coordinate === 665) {
									Perpendicular += 50
									coordinate = 15
									line += 1
								}
									if(last === "P"){
										const background = await Canvas.loadImage('./img/current/current.png');
										context.drawImage(background, 0, 0, canvas.width, canvas.height);
										const sub_image = await Canvas.loadImage('./img/player_ball.png');
										context.drawImage(sub_image, coordinate, Perpendicular, 50, 50);
										coordinate += 50
									} else if(last === "B") {
										const background = await Canvas.loadImage('./img/current/current.png');
										context.drawImage(background, 0, 0, canvas.width, canvas.height);
										const sub_image = await Canvas.loadImage('./img/banker_ball.png');
										context.drawImage(sub_image, coordinate, Perpendicular, 50, 50);
										coordinate += 50
									} else if(last === "T") {
										const background = await Canvas.loadImage('./img/current/current.png');
										context.drawImage(background, 0, 0, canvas.width, canvas.height);
										const sub_image = await Canvas.loadImage('./img/tai_ball.png');
										context.drawImage(sub_image, coordinate, Perpendicular, 50, 50);
										coordinate += 50
									}

								const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'image.png' });
								let img_embed = new EmbedBuilder()
								.setTitle(`**                    4       /      4        **\n \n \`🔵플레이어  ||  🔴뱅커\`\n \n**          ${card['card1']}   |  ${card['card3']}   //   ${card['card2']}   |  ${card['card4']}\n🔵플레이어 : ${result1}\n🔴뱅커 : ${result2}   ✅   < 승리! > X 1.95배\n🟢무승부**`)
								.setColor(0xFF0000)
								.setImage('attachment://image.png')
								car_msg5.edit({embeds: [img_embed],  files: [attachment] })
								const b = canvas.toBuffer('image/png')
								fs.writeFileSync(join('./img/current', 'current.png'), b)
							}
							if (result1 === result2) {
								const embed = new EmbedBuilder()
								.setTitle(`**                    4       /      4        **\n \n \`🔵플레이어  ||  🔴뱅커\`\n \n**          ${card['card1']}   |  ${card['card3']}   //   ${card['card2']}   |  ${card['card4']}\n🔵플레이어 : ${result1}\n🔴뱅커 : ${result2}\n🟢무승부   ✅   < 승리! > X 8배**`)
								.setColor(0x00F01C)
								car_msg6 = await car_msg3.edit({embeds: [embed]})
								let tai_find = dataa.map(v => { 
									if(v.value === 'tai') {
										return v
									}
								})
								let tai = tai_find.filter((element, i) => element !== undefined);
								for(var i = 0; i < tai.length; i++) {
									let find = dataaa.map(v => { 
										if(v.id === tai[i].id) {
											return v
										}
									})
									let users = find.filter((element, i) => element !== undefined);
									db.run(`UPDATE User SET money = ? WHERE id = ?`, [`${Number(users[0].money) + Number(tai[i].money)*8}`, `${tai[i].id}`])
								}
								db.run(`DELETE FROM betting`)
								if (picture.length === 48) picture = ''
								picture += 'T'

								const canvas = Canvas.createCanvas(700, 250);
								const context = canvas.getContext('2d');

								const background = await Canvas.loadImage('./img/background.png');
								context.drawImage(background, 0, 0, canvas.width, canvas.height);
								// Set the color of the stroke
								context.strokeStyle = '#0099ff';

								// Draw a rectangle with the dimensions of the entire canvas
								context.strokeRect(0, 0, canvas.width, canvas.height);

								let value = picture.replace(/(\s*)/g, "")
								let last = value[value.length - 1];
								if(coordinate === 665) {
									Perpendicular += 50
									coordinate = 15
									line += 1
								}
									if(last === "P"){
										const background = await Canvas.loadImage('./img/current/current.png');
										context.drawImage(background, 0, 0, canvas.width, canvas.height);
										const sub_image = await Canvas.loadImage('./img/player_ball.png');
										context.drawImage(sub_image, coordinate, Perpendicular, 50, 50);
										coordinate += 50
									} else if(last === "B") {
										const background = await Canvas.loadImage('./img/current/current.png');
										context.drawImage(background, 0, 0, canvas.width, canvas.height);
										const sub_image = await Canvas.loadImage('./img/banker_ball.png');
										context.drawImage(sub_image, coordinate, Perpendicular, 50, 50);
										coordinate += 50
									} else if(last === "T") {
										const background = await Canvas.loadImage('./img/current/current.png');
										context.drawImage(background, 0, 0, canvas.width, canvas.height);
										const sub_image = await Canvas.loadImage('./img/tai_ball.png');
										context.drawImage(sub_image, coordinate, Perpendicular, 50, 50);
										coordinate += 50
									}

								const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'image.png' });
								let img_embed = new EmbedBuilder()
								.setTitle(`**                    4       /      4        **\n \n \`🔵플레이어  ||  🔴뱅커\`\n \n**          ${card['card1']}   |  ${card['card3']}   //   ${card['card2']}   |  ${card['card4']}\n🔵플레이어 : ${result1}\n🔴뱅커 : ${result2}\n🟢무승부   ✅   < 승리! > X 8배**`)
								.setColor(0x00F01C)
								.setImage('attachment://image.png')
								car_msg6.edit({embeds: [img_embed],  files: [attachment] })
								const b = canvas.toBuffer('image/png')
								fs.writeFileSync(join('./img/current', 'current.png'), b)
							}
								ing = 'off'
						}
						
						cardorder += 1;	
					})
				})
			})
		}
    }
  }, 2000);

  let batting = setInterval(async function() {
	if (bakaratype === 'on') {
	if (ing === 'off') {
		player = {}
		banker = {}
		tai = {}
		cardorder = 0
		card = {
			"card1" : 0,
			"card2" : 0,
			"card3" : 0,
			"card4" : 0
		}

		const betting_Btn = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setStyle('Primary')
				.setLabel('플레이어')
				.setCustomId('Player2')
		)
		.addComponents(
			new ButtonBuilder()
				.setStyle('Success')
				.setLabel('무승부')
				.setCustomId('Tai2')
		)
		.addComponents(
			new ButtonBuilder()
				.setStyle('Danger')
				.setLabel('뱅커')
				.setCustomId('Banker2')
		)
		.addComponents(
			new ButtonBuilder()
				.setStyle('Secondary')
				.setLabel('정보')
				.setCustomId('Info')
		)
		.addComponents(
			new ButtonBuilder()
				.setStyle('Secondary')
				.setLabel('설정')
				.setCustomId('setting')
		)
		
		betting_btn = await channel.send({ content: '```🟩베팅을 하십시오.🟩```', components: [betting_Btn] })
		ing = 'send'
	}
	if (ing === 'send') {
		if (time === 15){
			betting_msg = await channel.send(`\`베팅마감까지 : ${time}초\``)
			time -= 1
		} else {
			betting_msg.edit(`\`베팅마감까지 : ${time}초\``)
			time -= 1
		}
		
		if (time === -1) {
			betting_btn.delete()
			channel.send('```🚫베팅 마감되었습니다.🚫```')
			ing = 'on'
			time = 15
		}
	}
}
  }, 1500);

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

				let modal = new ModalBuilder()
				.setCustomId('modal_setting')
				.setTitle('설정');

				let amount = new TextInputBuilder()
				.setCustomId('amount')
				.setLabel("얼마 씩 배팅하고 싶으십니까?")
				.setMinLength(4)
				.setMaxLength(8)
				.setStyle(TextInputStyle.Short)
				.setPlaceholder('숫자만 입력하세요 ')
				.setRequired(true)

				let firstActionRow = new ActionRowBuilder().addComponents(amount);
				modal.addComponents(firstActionRow);
				await interaction.showModal(modal);
			}
			if (interaction.isModalSubmit()) {
				let modal_Data = interaction.fields.getTextInputValue('amount');
				db.run(`UPDATE User SET betting_amount = ? WHERE id = ?`, [`${Number(modal_Data)}`, `${interaction.user.id}`])
				interaction.reply({
					content: `${modal_Data}의 금액으로 배팅액이 설정되었습니다`,
					ephemeral: true
				})
			  }
		})
	})
})


// client.channels.cache.get('1003229522243616828').send('hi')