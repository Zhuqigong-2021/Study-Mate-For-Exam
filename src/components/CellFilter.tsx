import { Badge } from "./ui/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";

// {
//   getValue, row, column, table;
// }
interface props {
  getValue: any;
  row: any;
  column: any;
  table: any;
  noteTitle: string;
  colorClass: string;
}
const CellFilter = ({
  noteTitle,
  colorClass,
  row,
  column,
  table,
  getValue,
}: props) => {
  const { title } = getValue;
  return (
    <ContextMenu>
      <ContextMenuTrigger className="h-full w-full">
        <Badge
          className={colorClass + " " + "flex w-12 justify-center text-white"}
        >
          {title}
        </Badge>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-full">
        <ContextMenuItem onClick={() => {}}>Filter Out</ContextMenuItem>
        <ContextMenuItem onClick={() => {}}>Show Matching</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default CellFilter;
