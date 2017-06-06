function main() {

  if (!Momo.initialize()) {

    alert("Error: Failed to initialize Momo!");

    return;
  }

  if (!Momo.setCanvas("game", 768, 448)) {

    alert("Error: Failed to set canvas!");

    return;
  }

  Momo.setFrameRate(60);

  loadResources();

  Momo.resourcesLoaded(

    () => {

      Momo.createLoop(

        () => {

          update();

          render();
        }
      );
    }
  );
}

function save() {

  level_data[level] = exportData();

  Smile.save();

  for (let i = 0; i < number_of_blocks; ++i) {

    Blocks[i].save();
  }
}

function restore() {

  if (!win) {

    let moving = false;

    if (Smile.isMoving()) {

      moving = true;
    }

    for (let i = 0; i < number_of_blocks; ++i) {

      if (Blocks[i].isMoving()) {

        moving = true;

        break;
      }
    }

    if (moving) {

      // Don't restore if the player or a block is moving.
      return;
    }
  }

  win = false;

  last_time = Momo.getTime();

  moves = 0;
  moves_counter = 0;

  Smile.restore();

  for (let i = 0; i < number_of_blocks; ++i) {

    Blocks[i].restore();
  }

  for (let i = 0; i < number_of_blocks; ++i) {

    undo_block_x[i] = [];
    undo_block_y[i] = [];
  }
}

function update() {

  if (Momo.isKeyPressed(Momo.KEY_D)) {

    // Toggle debug mode.
    debug = !debug;
  }

  if (Momo.isKeyPressed(Momo.KEY_E)) {

    // Toggle edit mode.
    edit_mode = !edit_mode;

    if (edit_mode) {

      restore();

      Momo.hideMouseCursor();
    }
    else {

      save();

      Momo.showMouseCursor();
    }
  }

  if (edit_mode) {

    if (Momo.isKeyPressed(Momo.KEY_DELETE)) {

      level = level_data.length;

      for (let y = 0; y < tiles_per_screen_y; ++y) {

        for (let x = 0; x < tiles_per_screen_x; ++x) {

          // Clear the objects layer.
          Objects.setTile(x, y, "00x00n");

          // Clear the background layer with dark tiles.
          Background.setTile(x, y, "01x00n");

          if (y == 0 || y == tiles_per_screen_y - 1 || x == 0 || x == tiles_per_screen_x - 1) {

            // Surround the objects layer with a solid border.
            Objects.setTile(x, y,  "03x00y");
          }
        }
      }

      // Move the player toward the center of the screen.
      Smile.setX(12 * tile_w);
      Smile.setY(7 * tile_h);

      number_of_blocks = 1;

      Blocks = [];

      Blocks[0] = new Block();

      // Spawn a single block.
      Blocks[0].setX(Smile.getX() + tile_w);
      Blocks[0].setY(Smile.getY());

      // Place a default goal.
      Background.setTile((Smile.getX() + tile_w) / tile_w, (Smile.getY() + tile_h) / tile_h, "05x00n");

      save();
    }

    if (Momo.isKeyPressed(Momo.KEY_A)) {

      --item;
    }
    else if (Momo.isKeyPressed(Momo.KEY_D)) {

      ++item;
    }

    if (item < 1) {

      item = 6;
    }
    else if (item > 6) {

      item = 1;
    }

    // Generate a name for the current item.
    switch (item) {

      case 1:

        item_text = "eraser";
      break;

      case 2:

        item_text = "tile";
      break;

      case 3:

        item_text = "wall";
      break;

      case 4:

        item_text = "block";
      break;

      case 5:

        item_text = "goal";
      break;

      case 6:

        item_text = "player";
      break;
    }

    // Get the mouse's position on the tile grid.
    mouse_tile_x = parseInt((Momo.getMouseX() / tile_w - 0.5).toFixed(0));
    mouse_tile_y = parseInt((Momo.getMouseY() / tile_h - 0.5).toFixed(0));

    if (mouse_tile_x < 1) {

      mouse_tile_x = 0;
    }
    else if (mouse_tile_x > tiles_per_screen_x - 1) {

      mouse_tile_x = tiles_per_screen_x - 1;
    }

    if (mouse_tile_y < 1) {

      mouse_tile_y = 0;
    }
    else if (mouse_tile_y > tiles_per_screen_y - 1) {

      mouse_tile_y = tiles_per_screen_y - 1;
    }

    if (Momo.isMouseButtonDown(Momo.MOUSE_BUTTON_LEFT)) {

      if (item == BLOCK) {

        for (let i = 0; i < number_of_blocks; ++i) {

          if (Blocks[i].getX() == (mouse_tile_x + 1) * tile_w && Blocks[i].getY() == (mouse_tile_y + 1) * tile_h) {

            // A block already exists here.
            return;
          }
        }

        ++number_of_blocks;

        Blocks[number_of_blocks - 1] = new Block();

        // Place a new block.
        Blocks[number_of_blocks - 1].setX((mouse_tile_x + 1) * tile_w);
        Blocks[number_of_blocks - 1].setY((mouse_tile_y + 1) * tile_h);

        // Erase the tile on the objects layer.
        Objects.setTile(mouse_tile_x + 1, mouse_tile_y + 1, "00x00n");
      }
      else if (item == ERASER) {

        eraseBlock();
      }
      else if (item == PLAYER) {

        // Set the player's spawn point.
        Smile.setX((mouse_tile_x + 1) * tile_w);
        Smile.setY((mouse_tile_y + 1) * tile_h);
      }
      else if (item == WALL) {

        eraseBlock();

        // Place the wall on the objects layer.
        Objects.setTile(mouse_tile_x + 1, mouse_tile_y + 1, "0" + item + "x00y");

        if (Background.getTile(mouse_tile_x + 1, mouse_tile_y + 1) == "05x00n") {

          // Clear the tile beneath the object on the background layer.
          Background.setTile(mouse_tile_x + 1, mouse_tile_y + 1, "00x00n");
        }
      }
      else {

        eraseBlock();

        // Place the item on the background layer.
        Background.setTile(mouse_tile_x + 1, mouse_tile_y + 1, "0" + item + "x00n");

        if (Objects.getTileFlag(mouse_tile_x + 1, mouse_tile_y + 1) == "y") {

          // Erase the tile from the objects layer.
          Objects.setTile(mouse_tile_x + 1, mouse_tile_y + 1, "00x00n");
        }
      }
    }
  }
  else {

    if (Momo.isKeyPressed(Momo.KEY_R)) {

      restore();
    }

    if (Momo.isKeyPressed(Momo.KEY_TILDE)) {

      restore();

      console.log(exportData());
    }

    if (Momo.isKeyPressed(Momo.KEY_N)) {

      loadNextLevel();
    }

    if (!win) {

      if (Momo.isKeyPressed(Momo.KEY_Z)) {

        if (moves > 0) {

          for (let i = 0; i < number_of_blocks; ++i) {

            if (Blocks[i].isMoving()) {

              // Moves can only be undone if the blocks are stationary.
              return;
            }
          }

          if (Smile.isMoving()) {

            // Moves can only be undone if the player is stationary.
            return;
          }

          --moves;

          // Undo player's last move.
          Smile.setX(undo_player_x[moves] * tile_w);
          Smile.setY(undo_player_y[moves] * tile_h);

          for (let i = 0; i < number_of_blocks; ++i) {

            if (undo_block_x[i][moves] != undefined || undo_block_y[i][moves] != undefined) {

              // Undo blocks' last moves.
              Blocks[i].setX(undo_block_x[i][moves] * tile_w);
              Blocks[i].setY(undo_block_y[i][moves] * tile_h);
            }

            for (let j = moves; j < undo_block_x.length; ++j) {

              // Delete outdated undo coordinates, as there is no "redo" function.
              undo_block_x[i][j] = undefined;
              undo_block_y[i][j] = undefined;
            }
          }

          for (let y = 0; y < tiles_per_screen_y; ++y) {

            for (let x = 0; x < tiles_per_screen_x; ++x) {

              if (Objects.getTile(x, y) == "04x00y") {

                // Remove the block markers from the objects layer.
                Objects.setTile(x, y, "00x00n");
              }
            }
          }

          ++moves_counter;
        }
      }

      Smile.update();
    }

    let count = 0;

    for (let i = 0; i < number_of_blocks; ++i) {

      if (Blocks[i].isMoving()) {

        // Wait for the block to reach its destination before winning.
        break;
      }

      if (Blocks[i].isOnGoal()) {

        ++count;
      }
    }

    if (!win && count > 0 && count == number_of_blocks) {

      // The current puzzle has been completed.
      win = true;

      time_difference = (Momo.getTime() - last_time).toFixed(0);
    }

    if (win && Momo.isKeyPressed(Momo.KEY_SPACE)) {

      loadNextLevel();
    }
  }

  for (let i = 0; i < number_of_blocks; ++i) {

    Blocks[i].update();
  }
}

function render() {

  Momo.clearCanvas(Momo.makeColor(0, 0, 0));

  let context = Momo.canvas.context;

  context.save();

  // Offset the view to obscure the solid boundaries.
  context.translate(-tile_w, -tile_h);

  Background.render();
  Objects.render();

  for (let i = 0; i < number_of_blocks; ++i) {

    Blocks[i].render();
  }

  Smile.render();

  if (debug) {

    // Show collision markers.

    for (let y = 0; y < tiles_per_screen_y; ++y) {

      for (let x = 0; x < tiles_per_screen_x; ++x) {

        if (Objects.getTileFlag(x, y) == "y") {

          // Surround solid objects with a red outline.
          Momo.drawRectangle(x * tile_w, y * tile_h, x * tile_w + tile_h, y * tile_w + tile_h, Momo.makeColor(255, 0, 0), 3);
        }
      }
    }
  }

  context.restore();

  if (!edit_mode) {

    // Draw the current level number.
    Momo.drawText(font_pixel, Momo.makeColor(255, 255, 255), 64, 8, -21, Momo.TEXT_ALIGN_LEFT, level + 1);

    // Draw number of moves player has made.
    Momo.drawText(font_pixel, Momo.makeColor(255, 255, 255), 64, Momo.getCanvasWidth() - 8, -21, Momo.TEXT_ALIGN_RIGHT, moves_counter);
  }

  if (win) {

    for (let y = 0; y < tiles_per_screen_y; ++y) {

      for (let x = 0; x < tiles_per_screen_x; ++x) {

        // Draw a dark background.
        Momo.drawPartialImage(

          image_tiles,

          tile_w,

          0,

          tile_w,

          tile_h,

          tile_w * x,

          tile_h * y
        );
      }
    }

    // Draw a half dark overlay.
    Momo.drawFilledRectangle(

      0,

      0,

      Momo.getCanvasWidth(),

      Momo.getCanvasHeight(),

      Momo.makeColor(0, 0, 0, 128)
    );

    context.save();

    context.translate(0, Momo.getCanvasHeight() / 4);

    Momo.drawText(

      font_pixel,

      Momo.makeColor(255, 255, 255),

      64,

      Momo.getCanvasWidth() / 2,

      -21,

      Momo.TEXT_ALIGN_CENTER,

      "- Level #" + (parseInt(level) + 1) + " Results -"
    );

    let results_text = "";

    results_text += "Solved in " + time_difference;
    results_text += " " + (time_difference == 1 ? "second" : "seconds");
    results_text += " with " + moves_counter + " " + (moves == 1 ? "move" : "moves") + ".";

    Momo.drawText(

      font_pixel,

      Momo.makeColor(255, 255, 255),

      48,

      Momo.getCanvasWidth() / 2,

      Momo.getCanvasHeight() / 4 - 48,

      Momo.TEXT_ALIGN_CENTER,

      results_text
    );

    Momo.drawText(

      font_pixel,

      Momo.makeColor(255, 255, 255),

      48,

      Momo.getCanvasWidth() / 2,

      Momo.getCanvasHeight() / 4 + 48 / 2,

      Momo.TEXT_ALIGN_CENTER,

      "Press \"R\" to play again or \"SPACE\" to continue."
    );

    context.restore();
  }

  if (edit_mode) {

    drawEditor();
  }
}

function loadNextLevel() {

  number_of_blocks = 0;

  ++level;

  if (level > level_data.length - 1) {

    level = 0;
  }

  importData(level_data[level]);
}

function loadResources() {

  font_pixel = Momo.loadFont("data/pixelade.ttf");

  image_tiles = Momo.loadImage("data/tiles.png");

  sound_push = Momo.loadSound("data/push.mp3");
  sound_goal = Momo.loadSound("data/goal.mp3");
  sound_error = Momo.loadSound("data/error.mp3");

  Smile = new Player();
  Objects = new Layer();
  Background = new Layer();

  for (let y = 0; y < tiles_per_screen_y; ++y) {

    for (let x = 0; x < tiles_per_screen_x; ++x) {

      // Fill the background layer with dark tiles.
      Background.setTile(x, y, "01x00n");
    }
  }

  // Load the first level.
  loadNextLevel();
}

function eraseBlock() {

  if (Objects.getTile(mouse_tile_x + 1, mouse_tile_y + 1) == "04x00y") {

    Objects.setTile(mouse_tile_x + 1, mouse_tile_y + 1, "00x00n");

    for (let i = 0; i < number_of_blocks; ++i) {

      if (Blocks[i].getX() == (mouse_tile_x + 1) * tile_w && Blocks[i].getY() == (mouse_tile_y + 1) * tile_h) {

        --number_of_blocks;

        // Delete the selected block.
        Blocks.splice(i, 1);
      }
    }
  }

  // Erase the tiles on both layers.
  Objects.setTile(mouse_tile_x + 1, mouse_tile_y + 1, "00x00n");
  Background.setTile(mouse_tile_x + 1, mouse_tile_y + 1, "01x00n");
}

function drawEditor() {

  // Draw the current item.
  Momo.drawPartialImage(

    image_tiles,

    tile_w * item,

    0,

    tile_w,

    tile_h,

    mouse_tile_x * tile_w,

    mouse_tile_y * tile_h
  );

  // Draw a highlight around the current item.
  Momo.drawPartialImage(

    image_tiles,

    tile_w * 9,

    0,

    tile_w,

    tile_h,

    mouse_tile_x * tile_w,

    mouse_tile_y * tile_h
  );

  // Draw a custom mouse cursor.
  Momo.drawPartialImage(

    image_tiles,

    tile_w * 8,

    0,

    tile_w,

    tile_h,

    Momo.getMouseX(),

    Momo.getMouseY()
  );

  // Draw the name of the current item.
  Momo.drawText(

    font_pixel,

    Momo.makeColor(255, 255, 255),

    48,

    mouse_tile_x * tile_w + tile_w / 2,

    mouse_tile_y * tile_h - tile_w * 2,

    Momo.TEXT_ALIGN_CENTER,

    item_text
  );
}

function exportData() {

  let data = "";

  let count = 0;

  data = Smile.getX() / tile_w + ", " + Smile.getY() / tile_h + ";\n\n";

  for (let y = 0; y < tiles_per_screen_y; ++y) {

    for (let x = 0; x < tiles_per_screen_x; ++x) {

      data += Background.getTile(x, y) + ", ";

      ++count;

      if (count == tiles_per_screen_x / 2) {

        count = 0;

        data = data.substring(0, data.length - 1) + "\n";
      }
    }
  }

  count = 0;

  data += ";\n\n";

  for (let i = 0; i < number_of_blocks; ++i) {

    Objects.setTile(Blocks[i].getX() / tile_w, Blocks[i].getY() / tile_h, "04x00y");
  }

  for (let y = 0; y < tiles_per_screen_y; ++y) {

    for (let x = 0; x < tiles_per_screen_x; ++x) {

      data += Objects.getTile(x, y) + ", ";

      ++count;

      if (count == tiles_per_screen_x / 2) {

        count = 0;

        data = data.substring(0, data.length - 1) + "\n";
      }
    }
  }

  return data;
}

function importData(data) {

  // Remove spaces, new lines, and soft tabs from the data.
  data = data.replace(/ /g, "");
  data = data.replace(/\n/g, "");
  data = data.replace(/  /g, "");

  let parts = data.split(";");

  let player_spawn = parts[0].split(",");

  // Set the player's spawn position.
  Smile.setX(player_spawn[0] * tile_w);
  Smile.setY(player_spawn[1] * tile_h);

  Background.setTiles(parts[1]);
  Objects.setTiles(parts[2]);

  for (let y = 0; y < tiles_per_screen_y; ++y) {

    for (let x = 0; x < tiles_per_screen_x; ++x) {

      if (Objects.getTile(x, y) == "04x00y") {

        ++number_of_blocks;

        Blocks[number_of_blocks - 1] = new Block();

        Blocks[number_of_blocks - 1].setX(x * tile_w);
        Blocks[number_of_blocks - 1].setY(y * tile_h);

        Objects.setTile(x, y, "00x00n");
      }
    }
  }

  save();
  restore();
}

Momo.loadFunction(main);
