var generateMessage = (from, text)=>{
  return {
    from,
    text,
    createdAt: new Date().getTime()
  };
};
var generateLocationMessage = (latitude, longitude)=>{
  return {
    latitude,
    longitude,
    url:`http://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: new Date().getTime()
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage
}
