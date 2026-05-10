import CanvasManager from "../tools/CanvasManager.mjs"
import rg from "../tools/RootGraph.mjs" 
import functions from "../tools/Functions.mjs"
import Vector2D from "../tools/Vector2D.mjs"
import Colors from "../tools/Colors.mjs"
import MegaState from "../tools/MegaState.mjs"

const cm = new CanvasManager("canvas")

const initial_state = {
}

const initial_tags_name = [
]

const mega_state = new MegaState({...initial_state}, [...initial_tags_name])

function redraw()
{}