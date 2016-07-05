
module.exports = {
    insertion: function (arr, compare)
    {
        for (var i = 1; i < arr.length; i++) {
            var held = arr[i];
            var index = 0;
            for (var runner = i - 1; runner >= 0; runner--) {
                if (compare(arr[runner], held)) {
                    index = runner + 1;
                    break;
                }
                arr[runner + 1] = arr[runner];
            }
            arr[index] = held;
        }
    }
};
