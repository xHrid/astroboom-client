import blockStates from "@/js/blockStates";

export default {

  methods: {
    renderMap(map) {
      let j = 2;

      if (map.length == 0) return;
      map.forEach((cell) => {
        if (cell.destroyed)
          j = 6;
        else if (cell.status == blockStates.seletected)
          j = 0;
        else if (cell.status == blockStates.hovering)
          j = 1
        else if (cell.status == blockStates.potentialSelect)
          j = 3
        else j = 2;

        this.ctx.drawImage(this.bunkerSS,
          this.bunkerImgSize*j, 0, this.bunkerImgSize, this.bunkerImgSize,
           cell.x, cell.y, cell.w, cell.h)
      });

      if (this.start) {
        const cell =
          this.p1Map[this.playerPostion.i * 2 + this.playerPostion.j];
        this.ctx.globalAlpha = 0.5;
        j = 5;
        if (!this.gameEnded) this.ctx.drawImage(this.bunkerSS,
          this.bunkerImgSize*j, 0, this.bunkerImgSize, this.bunkerImgSize,
           cell.x, cell.y, cell.w, cell.h)
        this.ctx.globalAlpha = 1;
      }
    },

    resetMapStatus(pixelMap) {
      if (!pixelMap) return;
      this.activeCells = [];
      pixelMap.forEach((cell) => {
        cell.status = blockStates.normal;
      });
    },

    arrayMapToPixelMap(map, x, y) {
      map.forEach((cell) => {
        cell.x = cell.j * this.homeSize + x;
        cell.y = cell.i * this.homeSize + y;
        cell.w = this.homeSize*0.9;
        cell.h = this.homeSize*0.9;
      });
    },

  },
};
