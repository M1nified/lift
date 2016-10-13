const enum Directions{
  None = -1,
  Up = 0,
  Down = 1
} 
const enum TaskAction{
  Pick = 0,
  Transport = 1
}
interface OuterButtonAction{
  direction : Directions,
  floor : Floor
}
interface InnerButtonAction{
  floor : Floor,
  destination : Floor,
  well : Well
}
interface Task{
  action : TaskAction,
  target : Floor,
  well ?: Well
}
