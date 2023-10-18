
const arr = [5, 7, 3, 2, 65, 8, 25466, 453, 533, 53, 4, 33, 43, 5, 54];

function selectSort(arr, n) {
    for (let i = 0; i < n; i++) {
        let k = i;
        for (let j = i; j < n; j++) {
            if (arr[j] < arr[k]) {
                k = j;
            }
        }
        let temp = arr[k];
        arr[k] = arr[i];
        arr[i] = temp;
    }
    return arr;
}
console.log("before sorting :");
console.log(...arr);
console.log("after sorting :");
selectSort(arr, arr.length);
console.log(...arr);