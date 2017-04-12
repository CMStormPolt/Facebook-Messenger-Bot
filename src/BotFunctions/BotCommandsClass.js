class BotCommands{
    constructor(fb){
        this.fb = fb;
    }
    processCommand(messageSpeach){
      if(this[messageSpeach]){
        return Promise.resolve(this[action](senderId,result))
    } else {
      return Promise.resolve(true);
    }
  } 
    BOT_Show_Pic(context){
        let self = context;
        message = {};
        message.attachment = self.imageAttachment(customObj.attachment)
        message.attachment.type = 'image';
        message.quick_replies = self.quickReplyMaker(['product detail','next','add to wish list'])
        message.type = 5;
        return message;
    }
}
module.exports.BotCommands = BotCommands;