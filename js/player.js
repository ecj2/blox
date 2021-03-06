class Player {

  constructor() {

    this.x = 0;
    this.y = 0;

    this.x_saved = 0;
    this.y_saved = 0;

    this.speed = 3;

    this.moving = false;

    this.start_tile = -1;
    this.stop_tile = -1;

    this.move = [false, false, false, false];
  }

  save() {

    this.x_saved = this.x;
    this.y_saved = this.y;
  }

  restore() {

    this.x = this.x_saved;
    this.y = this.y_saved;

    this.moving = false;

    this.start_tile = -1;
    this.stop_tile = -1;

    this.move = [false, false, false, false];
  }

  update() {

    if (this.move[UP]) {

      this.moveUp();
    }
    else if (this.move[DOWN]) {

      this.moveDown();
    }
    else if (this.move[LEFT]) {

      this.moveLeft();
    }
    else if (this.move[RIGHT]) {

      this.moveRight();
    }

    if (!this.moving) {

      if (Momo.isKeyDown("up")) {

        for (let i = 0; i < number_of_blocks; ++i) {

          if (collide(this.x, this.y - 1, Blocks[i].getX(), Blocks[i].getY())) {

            if (Objects.getTileFlag(this.x / tile_w, this.y / tile_h - 2) !== "y") {

              undo_block_x[i][moves] = Blocks[i].getX() / tile_w;
              undo_block_y[i][moves] = Blocks[i].getY() / tile_h;

              Blocks[i].push(UP);
            }
          }
        }

        if (Objects.getTileFlag(this.x / tile_w, this.y / tile_h - 1) !== "y") {

          undo_player_x[moves] = this.x / tile_w;
          undo_player_y[moves] = this.y / tile_h;

          this.move[UP] = true;

          ++moves;
          ++moves_counter;
        }
        else {

          if (Objects.getTile(this.x / tile_w, this.y / tile_h - 1) === "03x00y") {

            // The player can not move up.

            if (!Momo.isSamplePlaying(0)) {

              Momo.playSample(sound_error, 1.0, 1.0, false, 0);
            }
          }
          else {

            let tile_x = this.x / tile_w;
            let tile_y = this.y / tile_h - 1;

            let block_number = undefined;

            for (let i = 0; i < number_of_blocks; ++i) {

              if (Blocks[i].getX() === tile_x * tile_w && Blocks[i].getY() === tile_y * tile_h) {

                block_number = i;

                break;
              }
            }

            if (block_number !== undefined) {

              if (!Blocks[block_number].isPushable(UP)) {

                // The block can not be pushed up.

                if (!Momo.isSamplePlaying(0)) {

                  Momo.playSample(sound_error, 1.0, 1.0, false, 0);
                }
              }
            }
          }
        }
      }
      else if (Momo.isKeyDown("down")) {

        for (let i = 0; i < number_of_blocks; ++i) {

          if (collide(this.x, this.y + 1, Blocks[i].getX(), Blocks[i].getY())) {

            if (Objects.getTileFlag(this.x / tile_w, this.y / tile_h + 2) !== "y") {

              undo_block_x[i][moves] = Blocks[i].getX() / tile_w;
              undo_block_y[i][moves] = Blocks[i].getY() / tile_h;

              Blocks[i].push(DOWN);
            }
          }
        }

        if (Objects.getTileFlag(this.x / tile_w, this.y / tile_h + 1) !== "y") {

          undo_player_x[moves] = this.x / tile_w;
          undo_player_y[moves] = this.y / tile_h;

          this.move[DOWN] = true;

          ++moves;
          ++moves_counter;
        }
        else {

          if (Objects.getTile(this.x / tile_w, this.y / tile_h + 1) === "03x00y") {

            // The player can not move down.

            if (!Momo.isSamplePlaying(0)) {

              Momo.playSample(sound_error, 1.0, 1.0, false, 0);
            }
          }
          else {

            let tile_x = this.x / tile_w;
            let tile_y = this.y / tile_h + 1;

            let block_number = undefined;

            for (let i = 0; i < number_of_blocks; ++i) {

              if (Blocks[i].getX() === tile_x * tile_w && Blocks[i].getY() === tile_y * tile_h) {

                block_number = i;

                break;
              }
            }

            if (block_number !== undefined) {

              if (!Blocks[block_number].isPushable(DOWN)) {

                // The block can not be pushed down.

                if (!Momo.isSamplePlaying(0)) {

                  Momo.playSample(sound_error, 1.0, 1.0, false, 0);
                }
              }
            }
          }
        }
      }
      else if (Momo.isKeyDown("left")) {

        for (let i = 0; i < number_of_blocks; ++i) {

          if (collide(this.x - 1, this.y, Blocks[i].getX(), Blocks[i].getY())) {

            if (Objects.getTileFlag(this.x / tile_w - 2, this.y / tile_h) !== "y") {

              undo_block_x[i][moves] = Blocks[i].getX() / tile_w;
              undo_block_y[i][moves] = Blocks[i].getY() / tile_h;

              Blocks[i].push(LEFT);
            }
          }
        }

        if (Objects.getTileFlag(this.x / tile_w - 1, this.y / tile_h) !== "y") {

          undo_player_x[moves] = this.x / tile_w;
          undo_player_y[moves] = this.y / tile_h;

          this.move[LEFT] = true;

          ++moves;
          ++moves_counter;
        }
        else {

          if (Objects.getTile(this.x / tile_w - 1, this.y / tile_h) === "03x00y") {

            // The player can not move left.

            if (!Momo.isSamplePlaying(0)) {

              Momo.playSample(sound_error, 1.0, 1.0, false, 0);
            }
          }
          else {

            let tile_x = this.x / tile_w - 1;
            let tile_y = this.y / tile_h;

            let block_number = undefined;

            for (let i = 0; i < number_of_blocks; ++i) {

              if (Blocks[i].getX() === tile_x * tile_w && Blocks[i].getY() === tile_y * tile_h) {

                block_number = i;

                break;
              }
            }

            if (block_number !== undefined) {

              if (!Blocks[block_number].isPushable(LEFT)) {

                // The block can not be pushed left.

                if (!Momo.isSamplePlaying(0)) {

                  Momo.playSample(sound_error, 1.0, 1.0, false, 0);
                }
              }
            }
          }
        }
      }
      else if (Momo.isKeyDown("right")) {

        for (let i = 0; i < number_of_blocks; ++i) {

          if (collide(this.x + 1, this.y, Blocks[i].getX(), Blocks[i].getY())) {

            if (Objects.getTileFlag(this.x / tile_w + 2, this.y / tile_h) !== "y") {

              undo_block_x[i][moves] = Blocks[i].getX() / tile_w;
              undo_block_y[i][moves] = Blocks[i].getY() / tile_h;

              Blocks[i].push(RIGHT);
            }
          }
        }

        if (Objects.getTileFlag(this.x / tile_w + 1, this.y / tile_h) !== "y") {

          undo_player_x[moves] = this.x / tile_w;
          undo_player_y[moves] = this.y / tile_h;

          this.move[RIGHT] = true;

          ++moves;
          ++moves_counter;
        }
        else {

          if (Objects.getTile(this.x / tile_w + 1, this.y / tile_h) === "03x00y") {

            // The player can not move right.

            if (!Momo.isSamplePlaying(0)) {

              Momo.playSample(sound_error, 1.0, 1.0, false, 0);
            }
          }
          else {

            let tile_x = this.x / tile_w + 1;
            let tile_y = this.y / tile_h;

            let block_number = undefined;

            for (let i = 0; i < number_of_blocks; ++i) {

              if (Blocks[i].getX() === tile_x * tile_w && Blocks[i].getY() === tile_y * tile_h) {

                block_number = i;

                break;
              }
            }

            if (block_number !== undefined) {

              if (!Blocks[block_number].isPushable(RIGHT)) {

                // The block can not be pushed right.

                if (!Momo.isSamplePlaying(0)) {

                  Momo.playSample(sound_error, 1.0, 1.0, false, 0);
                }
              }
            }
          }
        }
      }
    }
  }

  render() {

    Momo.drawClippedBitmap(

      image_tiles,

      tile_w * 6,

      0,

      tile_w,

      tile_h,

      this.x,

      this.y
    );
  }

  moveUp() {

    if (!this.moving) {

      this.start_tile = this.y / tile_h;
      this.stop_tile = this.start_tile - 1;

      this.moving = true;
    }

    if (this.y > this.stop_tile * tile_h) {

      this.y -= this.speed;
    }
    else {

      this.y = this.stop_tile * tile_h;

      this.moving = false;

      this.move[UP] = false;
    }
  }

  moveDown() {

    if (!this.moving) {

      this.start_tile = this.y / tile_h;
      this.stop_tile = this.start_tile + 1;

      this.moving = true;
    }

    if (this.y < this.stop_tile * tile_h) {

      this.y += this.speed;
    }
    else {

      this.y = this.stop_tile * tile_h;

      this.moving = false;

      this.move[DOWN] = false;
    }
  }

  moveLeft() {

    if (!this.moving) {

      this.start_tile = this.x / tile_w;
      this.stop_tile = this.start_tile - 1;

      this.moving = true;
    }

    if (this.x > this.stop_tile * tile_h) {

      this.x -= this.speed;
    }
    else {

      this.x = this.stop_tile * tile_w;

      this.moving = false;

      this.move[LEFT] = false;
    }
  }

  moveRight() {

    if (!this.moving) {

      this.start_tile = this.x / tile_w;
      this.stop_tile = this.start_tile + 1;

      this.moving = true;
    }

    if (this.x < this.stop_tile * tile_h) {

      this.x += this.speed;
    }
    else {

      this.x = this.stop_tile * tile_w;

      this.moving = false;

      this.move[RIGHT] = false;
    }
  }

  setX(x) {

    this.x = x;
  }

  setY(y) {

    this.y = y;
  }

  getX() {

    return this.x;
  }

  getY() {

    return this.y;
  }

  isMoving() {

    return this.moving;
  }
}
