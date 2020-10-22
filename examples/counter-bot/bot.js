require('dotenv').config();
const discoss = require('discoss-framework')


const counterBot = new discoss.Bot({
    prefix: '&',
    variables: {
        counter: 0
    },
    commands: {
        'count': {
            function: (msg, params, variables) => {
                variables.counter += params.count
                msg.channel.send(variables.counter)
            },
            description: 'Count up',
            parameters: {
                count: {
                    type: Number,
                    description: 'Finite Number'
                }
            }
        }
    }
})

counterBot.login(process.env.TOKEN).then(() => {
    return console.log('Bot Online');
}).catch(err => {
    return console.log(err)
});