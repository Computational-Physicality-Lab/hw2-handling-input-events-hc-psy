# hw2-handling-input-events

- 學號：D08227104
- 系級：心理博四
- 姓名：駱皓正

### 1. Requirements

The requirements for this project are divided into three parts: General Requirements, Basic Requirements, and Bonus Requirements.

#### 1.1 General Requirements

The general requirements include two criteria: putting the code in the correct subfolder and ensuring that the code works no matter how many `div`s there are.

#### 1.2 Basic Requirements

The basic requirements include two sections: Mouse Event and Touch Event.

##### 1.2.1 Mouse Event

* [X] The mouse event requirements include several criteria:

* Mouse-click on a `div`
* Mouse-click on workarea, not on any objects
* Mouse down on a `div` and move (dragging mode)
  * `div` starts moving, following the mouse, until mouse-up.
  * This way of moving should not change the selected `div`.
* Mouse double-click (following mode)
  * Starts a mode in which this `div` follows the mouse.
  * The `div` should stop following the mouse on the next mouse up event.
  * While in this mode, all other mouse behaviors on the `div`s should be suspended.
* `ESC` keydown
  * The moving or growing should be aborted.
  * The `div` should go back to the way it was before the operation starts.

##### 1.2.2 Touch Event

* [X] The touch event requirements include several criteria:

* One-finger tap and double-tap
  * Do the same thing as mouse-click, dragging and mouse-double-click.
  * Double tap (following-the-finger mode): When you do touchstart, the `div` follows the finger even if the touch is not on the object, until touchend.
  * Touchend does not stop the mode, so the next touchstart continues to move the same `div`. This mode only ends with a click action.
  * If the user puts down another finger in the following-the-finger mode, then this should be aborted (same as `ESC` keydown).
* Two-finger touch
  * Resizing in horizontal direction.
  * If one finger is released but the other stays on the screen, this should stop the size change as it last was (just stop growing but not abort).
  * If the finger goes back into contact before the other finger lets up, the div can go back to changing size.
  * If a third finger is put down on the surface, this should abort the change size and go back to the original size before the change size started.
  * Minimum width and height for the `div` (`20pt` for each).

#### 1.3 Bonus Requirements

* [X] The bonus requirements include one criterion: resizing in either horizontal or vertical directions, depending on the orientation of the fingers when they both touch the surface.

### 2. Deployment

The code for this project have been deployed on Netlify, which provides free hosting for static websites. [LINK](https://legendary-bienenstitch-7e8a71.netlify.app)

### 3. Control Strategy

The control strategy for this project involves using several variables to keep track of the current state of the system and user inputs.

#### 3.1 Mouse Event

Three global variables are used to switch between states: `isHandDown`: Controls the move and reset operations in dragging mode and following mode. Set to `false` by default. `isClicked`: Controls whether all selected `div`s should be cleared.  `clickWorks`: Controls whether to change selected `div` when another `div` is clicked. 

#### 3.2 Touch Event

The variable `stateOfTouch` is used to store the current state of the process. There are several states:

1. Idle:
   * Default mode.
   * On touchmove event of a `div`, change to `2. Dragging` state.
   * On touchend event of one-finger tap on a `div`, change to `3. Selected` state.
   * On touchend event of double-tap on a `div`, change to `4. Follow` state.
2. Dragging:
   * The `div` is in dragging mode and can be dragged.
   * On touchend event of the workspace:
     * If another finger is put down (Canceled), change to `6. Canceled Dragging` state.
     * Else if there is a selected `div`, change to `7. Focused` state.
     * Else, change to `1. Idle` state.
3. Selected:
   * The `div` is selected and can be further operated.
   * On touchstart of the workspace, if a two-finger touch is detected, change to `8. Resizing` state.
   * On touchend event of one-finger tap on a `div`, change to `3. Selected` state.
   * On touchend event of double-tap on a `div`, change to `4. Follow` state.
   * On touchend event of the workspace, change to `1. Idle` state.
4. Follow:
   * The `div` is in following-the-finger mode.
   * On touchend event of the workspace:
     * If another finger is put down (Canceled), change to `7. Focused` state.
     * If a click action (touchstart and touchend quickly in the same place) is detected, change to `1. Idle` state.
5. Resize:
   * The selected `div` is in resizing mode and can be resized in either horizontal and vertical directions.
   * On touchstart event of a `div`, if a third-finger touch is detected, change to `7. Focused` state.
   * On touchend event of the workspace, if all fingers have left the screen (`e.touches.length == 0`), change to `7. Focused` state.
6. Canceled Dragging:
   * The dragging mode is canceled, and further moving is disabled.
   * On touchend event of a `div`:
     * If there is a selected `div`, change to `7. Focused` state.
     * Else, change to `1. Idle` state.
7. Focused:
   * A `div` is selected and can be further operated.
   * On touchstart of the workspace, if a two-finger touch is detected, change to `5. Resize` state.
   * On touchend event of one-finger tap on a `div`, change to `3. Selected` state.
   * On touchend event of double-tap on a `div`, change to `4. Follow` state.
   * On touchend event of the workspace, change to `1. Idle` state.
8. Resizing:
   * The selected `div` is in resizing mode and can be resized in either horizontal and vertical directions.
   * On touchstart event of a `div`, if a third-finger touch is detected, change to `7. Focused` state.
   * On touchend event of the workspace, if all fingers have left the screen (`e.touches.length == 0`), change to `7. Focused` state

### 4. Anything Else

Resizing on the boundary is implemented in this project. Any resizing attempts to make the `div` out of the boundary of the screen will just be ignored, but the resizing mode continues, in case the user moves their fingers further apart again.
