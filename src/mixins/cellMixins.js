import blockStates from "@/js/blockStates";

export default {
  methods: {
    detectHover(pixelMap) {
      pixelMap.forEach((cell) => {
        if (
          cell.status != blockStates.seletected &&
          cell.status != blockStates.potentialSelect
        ) {
          if (
            cell.x < this.mousePosition.x &&
            this.mousePosition.x < cell.x + cell.w &&
            cell.y < this.mousePosition.y &&
            this.mousePosition.y < cell.y + cell.h
          ) {
            if (cell.status != blockStates.destroyed)
              cell.status = blockStates.hovering;
          } else cell.status = blockStates.normal;
        }
      });
    },

    renderSafeSqares() {
        this.p1Map.forEach((cell) => {
          this.safeSquares.forEach((ss) => {
            if (ss[0] == cell.i && ss[1] == cell.j) {
              this.ctx.drawImage(this.bunkerSS,
                this.bunkerImgSize*7, 0, this.bunkerImgSize, this.bunkerImgSize,
                 cell.x, cell.y, cell.w, cell.h)
            }
          });
        });
      },
  
      generateSafeSqare() {
        this.safeSquares = [];
        let i = 0;
        const visited = [];
        this.safeSquares.push([this.playerPostion.i, this.playerPostion.j]);
        while (i < this.safeSquares.length) {
          this.p1Map[
            this.safeSquares[i][0] * 2 + this.safeSquares[i][1]
          ].adj.forEach((con) => {
            if (!visited.includes(con[0] * 2 + con[1]))
              this.safeSquares.push([...con]);
          });
          visited.push(this.safeSquares[i][0] * 2 + this.safeSquares[i][1]);
          i++;
        }
  
        console.log("safe sqares generated, ", this.safeSquares);
      },

      initiateReturn() {
        this.returnFlag = true;
        this.generateSafeSqare();
        this.renderSafeSqares();
      },

  },
};
