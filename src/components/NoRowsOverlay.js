import React from "react";
import { GridOverlay } from "@material-ui/data-grid";

const NoRowsOverlay = () => <GridOverlay><div>Список результатов пуст</div></GridOverlay>


export default React.memo(NoRowsOverlay)