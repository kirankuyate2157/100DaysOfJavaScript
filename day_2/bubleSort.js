const arr = [5, 8, 88, 45, 6, 567, 567, 8, 8, 435, 87, 84, 2, 5, 7, 11, 2];

const bubbleSort = (arr, n) => {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j + 1] < arr[j]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
}
console.log("before sorting :");
console.log(...arr);
console.log("after sorting :");
bubbleSort(arr, arr.length);
console.log(...arr);