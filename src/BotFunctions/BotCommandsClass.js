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
}
module.exports.BotCommandsClass = BotCommandsClass;