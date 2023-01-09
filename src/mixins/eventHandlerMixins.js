import emitNames from "@/js/emitNames";
import blockStates from "@/js/blockStates";


export default {
    methods: {
        clickHandler(pixelMap, x, y) {
            if (this.returnFlag) {
              this.p1Map.forEach((cell) => {
                if (
                  cell.x < x &&
                  x < cell.x + cell.w &&
                  cell.y < y &&
                  y < cell.y + cell.h
                ) {
                  this.safeSquares.forEach((ss) => {
                    if (ss[0] == cell.i && ss[1] == cell.j) {
                      this.attackingSquare = {
                        x: this.p2Map[this.activeCells[0].i*2 + this.activeCells[0].j].x,
                        y: this.p2Map[this.activeCells[0].i*2 + this.activeCells[0].j].y
                      }
                      this.socket.emit(
                        emitNames.go,
                        this.moveSelected,
                        this.activeCells,
                        { i: cell.i, j: cell.j },
                        this.playerPostion
                      );
                      this.playerPostion.i = cell.i;
                      this.playerPostion.j = cell.j;
                      this.returnFlag = false;
                    }
                  });
                }
              });
              return;
            }
      
            let clickedCell = null;
      
            if (this.activeCells.length >= 2) {
              this.activeCells.forEach(
                (ac) => (pixelMap[ac.i * 2 + ac.j].status = blockStates.normal)
              );
              this.activeCells = [];
            }
      
            if (pixelMap) {
              pixelMap.forEach((cell) => {
                if (
                  cell.x < x &&
                  x < cell.x + cell.w &&
                  cell.y < y &&
                  y < cell.y + cell.h
                ) {
                  clickedCell = {
                    i: cell.i,
                    j: cell.j,
                    status: cell.status,
                    destroyed: cell.destroyed,
                  };
                }
                if (cell.status == blockStates.seletected)
                  if (
                    this.activeCells[0].i != cell.i &&
                    this.activeCells[0].j != cell.j
                  )
                    this.activeCells.push({ i: cell.i, j: cell.j });
      
                cell.status = blockStates.normal;
              });
            }
      
            if (clickedCell && clickedCell.destroyed) return;
      
            let activeClicked = false;
      
            if (clickedCell) {
              this.activeCells.forEach((activeCell) => {
                if (activeCell.i == clickedCell.i && activeCell.j == clickedCell.j) {
                  activeClicked = true;
                } else if (clickedCell.status != blockStates.potentialSelect) {
                  this.activeCells = [];
                }
              });
      
              if (activeClicked) this.resetMapStatus(pixelMap);
              else this.activeCells.push({ i: clickedCell.i, j: clickedCell.j });
      
              this.activeCells.forEach((activeCell) => {
                pixelMap[activeCell.i * 2 + activeCell.j].status =
                  blockStates.seletected;
              });
            } else if (pixelMap) this.resetMapStatus(pixelMap);
          },
    }
}