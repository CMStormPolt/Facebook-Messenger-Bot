

class BotCommandsClass{
    constructor(fb){
        this.fb = fb;
    }
    processCommand(messageSpeach,message,customObj){
      if(this[messageSpeach]){
        return Promise.resolve(this[messageSpeach](message,customObj))
    } else {
      return Promise.resolve(message);
    }
  } 
    BOT_Show_Pic(message,customObj){
        message = {};
        message.attachment = this.fb.imageAttachment(customObj.attachment)
        message.attachment.type = 'image';
        message.type = 5;
        return message
    }
    BOT_Show_Random_Product(message,customObj){
        message = {};
        message.attachment = this.fb.imageAttachment(customObj.attachment)
        message.attachment.type = 'image';
        message.quick_replies = this.fb.quickReplyMaker(['product detail','next','add to wish list'])
        message.type = 5;
        return message;
    }
    // prototype command for sendind back a url button for permission granting
    BOT_Send_Message_With_Postback_Buttons(message,customObj){
        message = {};
        message.type = 5;
        message.attachment = {
            type: 'template',
            payload: {
                template_type : "button",
                text :"We are gonna need some addition info to help you with that?",
        buttons: [
          {
            type: "web_url",
            title: "Allow Addition Info",
            url: 'https://www.facebook.com/v2.0/dialog/oauth?response_type=code&redirect_uri=https%3A%2F%2F6f5a9032.ngrok.io%2Fabc&client_id=125824107950843',
            webview_height_ratio: "compact"
            }
          ]
        }
      }
        return message;
    }
}
module.exports.BotCommandsClass = BotCommandsClass;