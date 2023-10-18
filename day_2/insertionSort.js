const arr = [2, 4, 1, 2, 23, 22, 43, 55, 46, 6, 36, 575, 76, 86, 8, 7, 686];
const insertionSort = (arr, n) => {
    for (let i = 1; i < n; i++) {
        let temp = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > temp) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = temp;
    }
}
console.log("before sorting :");
console.log(...arr);
console.log("after sorting :");
insertionSort(arr, arr.length);
console.log(...arr);