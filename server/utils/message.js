const moment = require('moment')
var generateMessage = (from, text)=>{
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};
var generateLocationMessage = (name, latitude, longitude)=>{
  return {
    name,
    url:`http://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage
}
