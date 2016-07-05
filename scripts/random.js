
module.exports = {
    range: function (min, max)
    {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    chance: function (percent)
    {
        return Math.random() < (percent * 0.01);
    }
};