const axios = require('axios');
const { API_KEY_OPEN_AI } = require('../config');

const keys = ["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", "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", "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", "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"];

const randomIndex = Math.floor(Math.random() * keys.length);
const randomKey = keys[randomIndex];



const ChatAIHandler = async (text, msg) => {

    const cmd = text.split('/');

    if (cmd.length < 2) {
        return msg.reply('Format Salah. ketik *#ask/your question*');
    }

    msg.reply('sedang diproses, tunggu bentar ya.');

    const question = cmd[1];
    const response = await ChatGPTRequest(question)

    if (!response.success) {
        return msg.reply(response.message);
    }

    return msg.reply(response.data);
}


const ChatGPTRequest = async (text) => {

    const result = {
        success: false,
        data: null,
        message: "",
    }

    return await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        data: {
            model: "text-davinci-003",
            prompt: text,
            max_tokens: 1000,
            temperature: 0
        },
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Accept-Language": "in-ID",
            "Authorization": `Bearer ${randomKey}`,
        },
    })
        .then((response) => {
            if (response.status == 200) {
                result.success = true;
                result.data = response.data?.choices?.[0]?.text || 'Aku gak tau';
            } else {
                result.message = "Failed response";
            }

            return result;
        })
        .catch((error) => {
            result.message = "Error : " + error.message;
            return result;
        });
}

module.exports = {
    ChatAIHandler
}