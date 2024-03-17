export const lineOption = {
  legend: {
    right: 10,
    icon: "circle"
  },
  tooltip: {
    trigger: "axis",
    triggerOn: "mousemove",
    axisPointer: { type: "line" },
    showContent: false,
  },
  xAxis: {
    type: "category",
    data: [
      "2024-03-10",
      "2024-03-11",
      "2024-03-12",
      "2024-03-13",
      "2024-03-14",
      "2024-03-15",
      "2024-03-16"
    ],
    triggerEvent: true,
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "累计收益率",
      data: [150, 230, 224, 218, 135, 147, 260],
      type: "line"
    },
    {
      name: "BTC跌涨幅",
      data: [154, 220, 220, 218, 125, 157, 230],
      type: "line"
    }
  ]
};

export const barOption = {
  title: {},
  tooltip: {},
  xAxis: {
    data: [
      "2024-03-10",
      "2024-03-11",
      "2024-03-12",
      "2024-03-13",
      "2024-03-14",
      "2024-03-15",
      "2024-03-16"
    ]
  },
  yAxis: {},
  series: [
    {
      name: "sales",
      type: "bar",
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
};

export const assetsLineOption = {
  xAxis: {
    type: "category",
    data: [
      "2024-03-10",
      "2024-03-11",
      "2024-03-12",
      "2024-03-13",
      "2024-03-14",
      "2024-03-15",
      "2024-03-16"
    ]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [154, 220, 220, 218, 125, 157, 230],
      type: "line"
    }
  ]
};

export const pieOption = {
  title: {
    text: "Pie Chart",
    left: "center"
  },
  tooltip: {
    trigger: "item"
  },
  legend: {
    orient: "vertical",
    left: "left"
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: "50%",
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
};

export const scoreOption = {
  tooltip: {
    formatter: "{a} <br/>{b} : {c}%"
  },
  series: [
    {
      name: "Pressure",
      type: "gauge",
      detail: {
        formatter: "{value}"
      },
      data: [
        {
          value: 50,
          name: "SCORE"
        }
      ]
    }
  ]
};
