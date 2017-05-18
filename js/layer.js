class Layer {

  constructor() {

    this.tiles = [];

    for (let x = 0; x < tiles_per_screen_x; ++x) {

      this.tiles[x] = [tiles_per_screen_y];
    }

    for (let y = 0; y < tiles_per_screen_y; ++y) {

      for (let x = 0; x < tiles_per_screen_x; ++x) {

        // Populate the layer with empty tiles.
        this.tiles[x][y] = "00x00n";
      }
    }
  }

  render() {

    for (let y = 0; y < tiles_per_screen_y; ++y) {

      for (let x = 0; x < tiles_per_screen_x; ++x) {

        // Split the tiles into its axes.
        let axis_x = this.tiles[x][y].substring(0, 2);
        let axis_y = this.tiles[x][y].substring(3, 5);

        // Draw the tiles.
        Momo.drawPartialImage(

          image_tiles,

          tile_w * axis_x,

          tile_h * axis_y,

          tile_w,

          tile_h,

          tile_w * x,

          tile_h * y
        );
      }
    }
  }

  setTile(x, y, value) {

    this.tiles[x][y] = value;
  }

  getTile(x, y) {

    return this.tiles[x][y];
  }

  getTileFlag(x, y) {

    return this.tiles[x][y].substring(5, 6);
  }

  setTiles(values) {

    let tile_values = values.split(",");

    let next = 0;

    for (let y = 0; y < tiles_per_screen_y; ++y) {

      for (let x = 0; x < tiles_per_screen_x; ++x) {

        this.setTile(x, y, tile_values[next]);

        ++next;
      }
    }
  }
}
