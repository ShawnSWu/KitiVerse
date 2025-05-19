export const edgeLabelStyles = {
  fontSize: 16,  // 預設字體大小
  fontWeight: 700,
  fill: 'white',
  dominantBaseline: 'central',
  textAnchor: 'middle',
};

export const edgeLabelBackgroundStyles = {
  width: 200,    // 預設背景寬度
  height: 40,    // 預設背景高度
  rx: 6,         // 圓角半徑
  fill: 'rgba(0, 0, 0, 0.7)',
  stroke: 'none',
};

// 不同大小的預設樣式
export const edgeLabelSizes = {
  tiny: {
    fontSize: 10,
    background: {
      width: 120,
      height: 24,
    }
  },
  compact: {
    fontSize: 14,
    background: {
      width: 160,
      height: 32,
    }
  },
  normal: {
    fontSize: 18,
    background: {
      width: 200,
      height: 40,
    }
  },
  prominent: {
    fontSize: 24,
    background: {
      width: 240,
      height: 48,
    }
  },
  emphasis: {
    fontSize: 32,
    background: {
      width: 320,
      height: 64,
    }
  },
  highlight: {
    fontSize: 40,
    background: {
      width: 400,
      height: 80,
    }
  }
}; 