class Bot {
    // Bot constructor
    constructor (config) {     

        const discord = require('discord.js')

        this.client = new discord.Client();

        this.variables = config.variables

        this.usage = {}
        // Compose usage/help response for each command
        // Iterate through all commands defined
        for (const commandKey in config.commands) {
            if (config.commands.hasOwnProperty(commandKey)) {
                const command = config.commands[commandKey]

                // Initialize usage string
                this.usage[commandKey] = `${commandKey} `
                // Iterate through all parameters
                for (const paramKey in command.parameters) {
                    if (command.parameters.hasOwnProperty(paramKey)) {
                        const param = command.parameters[paramKey];
                        this.usage[commandKey] += `[${paramKey} | ${param.description}]`
                    }
                }
            }
        }

        

        // Compose help message using command usage
        let helpResponse = '```'
        for (const key in config.commands) {
            if (config.commands.hasOwnProperty(key)) {
                helpResponse += `\n${this.usage[key]}: ${config.commands[key].description}`
            }
        }
        helpResponse += '```'

        // Message handling
        this.client.on('message', msg => {
            // If missing prefix ignore message and return
            if (msg.content.split(' ')[0].slice(0, config.prefix.length) != config.prefix) return
            
            const commandWord = msg.content.split(' ')[0].slice(config.prefix.length)

            // Handle help command
            if (commandWord == 'help') {
                return msg.channel.send(helpResponse)
            }

            // Parse command and params into variable for readability
            const command = config.commands[msg.content.split(' ')[0].slice(config.prefix.length)];
            const params = msg.content.split(' ').slice(1)
            
            

            // Handle undefined commands
            if (command == undefined) return msg.channel.send('Command not found');

            // Execute command defined in config and parse the message, parameters and bot variables
            // config.commands[command].function(msg, params, this.variables)

            // Check msg valid parameters (defined in command definition) and add to a finalised parameter dictionary
            let parsedParams = {};
            let i = 0;
            for (const key in command.parameters) {
                // Iterate through all defined parameters and compare to their user inputed counter part
                if (command.parameters.hasOwnProperty(key)) {
                    const param = command.parameters[key];
                    // Number validation
                    if (param.type == Number) {
                        if (isNaN(param.type(params[i])) || !isFinite(param.type(params[i]))) return msg.channel.send(`Bad Command! \nUsage: ${this.usage[key]}`)
                        parsedParams[key] = param.type(params[i])
                    }
                    
                }
                i++;
            }

            // Execute command
            command.function(msg, parsedParams, this.variables)
        })
    }

    login (token) {
        return this.client.login(token)
    }
}


module.exports = {
    Bot: Bot
}