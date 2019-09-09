

export default {
  math: {
    lerp(start: number, end: number, amt: number) {
      return (1 - amt) * start + amt * end;
    },
    lerpFloat32Array(arr: Float32Array, values: Float32Array, offset: number, t: number) {
      let dist = 0;
      for (let i = 0; i < values.length; i++) {
        arr[offset + i] = arr[offset + i] + (values[i] - arr[offset + i]) * t;
        dist += (arr[offset + i] - values[i]) * (arr[offset + i] - values[i]);
      }
      return Math.sqrt(dist);
    },
    lerpOnArray(
      arr: Float32Array,
      index: number,
      values: number[],
      length: number,
      t: number) {
      for (let i = 0; i < length; i++) {
        arr[index * length + i] =
          arr[index * length + i] +
          (values[i] - arr[index * length + i]) * t;
      }
      let dist = 0;
      for (let i = 0; i < length; i++) {
        dist += arr[index * length] - values[i];
      }
      return Math.sqrt(dist);
    }
  }
};
