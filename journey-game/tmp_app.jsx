import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/App.jsx");const useEffect = __vite__cjsImport0_react["useEffect"]; const useState = __vite__cjsImport0_react["useState"];const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=ef8a9ef3";
import "/src/App.css";
var _jsxFileName = "C:/Users/psml1/OneDrive/Documents/GitHub/API/journey-game/src/App.jsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=ef8a9ef3";
var _s = $RefreshSig$();
const ROWS = 5;
const COLS = 12;
const START_ROW = 2;
const MAX_STAGE = 100;
const seedRandom = (seed) => {
	let value = seed;
	return () => {
		value = Math.imul(48271, value) % 2147483647;
		return (value - 1) / 2147483646;
	};
};
const createStage = (stage) => {
	const grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ({
		type: "empty",
		dirty: false
	})));
	const random = seedRandom(stage);
	const coinCount = Math.min(4 + Math.floor(stage / 3), 12);
	const obstacleCount = Math.min(Math.floor(stage / 2), 16);
	const dirtCount = stage >= 2 ? Math.min(3 + Math.floor(stage / 3), 14) : 0;
	const placeItems = (count, assign) => {
		let placed = 0;
		while (placed < count) {
			const row = Math.floor(random() * ROWS);
			const col = 1 + Math.floor(random() * (COLS - 2));
			if (row === START_ROW && col === COLS - 1) continue;
			if (grid[row][col].type === "empty") {
				assign(grid[row][col]);
				placed += 1;
			}
		}
	};
	placeItems(coinCount, (cell) => {
		cell.type = "coin";
	});
	placeItems(obstacleCount, (cell) => {
		cell.type = "obstacle";
	});
	let placedDirt = 0;
	while (placedDirt < dirtCount) {
		const row = Math.floor(random() * ROWS);
		const col = 1 + Math.floor(random() * (COLS - 2));
		const cell = grid[row][col];
		if (cell.type === "empty" && !cell.dirty) {
			cell.dirty = true;
			placedDirt += 1;
		}
	}
	grid[START_ROW][0].type = "start";
	grid[START_ROW][COLS - 1].type = "finish";
	return grid;
};
const stageLabel = (stage) => {
	if (stage === 1) return "Clean first journey";
	if (stage === 2) return "Dirty way with puddles";
	if (stage <= 5) return "More obstacles appear";
	if (stage <= 20) return "Rough route and faster coins";
	return "Master the journey";
};
const isValidGrid = (grid) => Array.isArray(grid) && grid.length === ROWS && grid.every((row) => Array.isArray(row) && row.length === COLS);
function App() {
	_s();
	const [stage, setStage] = useState(1);
	const [score, setScore] = useState(0);
	const [playerRow, setPlayerRow] = useState(START_ROW);
	const [playerCol, setPlayerCol] = useState(0);
	const [grid, setGrid] = useState(() => createStage(1));
	const [initialCoins, setInitialCoins] = useState(0);
	const [collected, setCollected] = useState(0);
	const [message, setMessage] = useState("Use Arrow Up/Down and Space to move.");
	useEffect(() => {
		const nextGrid = createStage(1);
		setGrid(nextGrid);
		setInitialCoins(nextGrid.flat().filter((cell) => cell.type === "coin").length);
	}, []);
	const loadStage = (nextStage) => {
		const nextGrid = createStage(nextStage);
		setGrid(nextGrid);
		setPlayerRow(START_ROW);
		setPlayerCol(0);
		setCollected(0);
		setInitialCoins(nextGrid.flat().filter((cell) => cell.type === "coin").length);
		setMessage(`Stage ${nextStage}: ${stageLabel(nextStage)}. Collect coins and reach finish.`);
	};
	const restartStage = () => {
		setMessage("Oops! You hit an obstacle. Restarting this stage...");
		setTimeout(() => loadStage(stage), 600);
	};
	const advanceStep = () => {
		if (!isValidGrid(grid) || playerRow < 0 || playerRow >= ROWS) {
			setMessage("Unable to move: board is not ready yet.");
			return;
		}
		if (playerCol >= COLS - 1) return;
		const nextCol = playerCol + 1;
		const target = grid[playerRow]?.[nextCol];
		if (!target) {
			setMessage("Unable to move: invalid board position.");
			return;
		}
		if (target.type === "obstacle") {
			restartStage();
			return;
		}
		if (target.type === "coin") {
			setScore((value) => value + 10);
			setCollected((value) => value + 1);
			setMessage("Nice! You collected a coin.");
			setGrid((currentGrid) => currentGrid.map((row, rowIndex) => row.map((cell, colIndex) => rowIndex === playerRow && colIndex === nextCol ? {
				...cell,
				type: "empty"
			} : cell)));
		}
		setPlayerCol(nextCol);
		if (nextCol === COLS - 1) {
			setMessage("Stage complete! Tap Next Stage to continue.");
		}
	};
	const moveRow = (direction) => {
		setPlayerRow((current) => {
			const next = current + direction;
			return Math.max(0, Math.min(ROWS - 1, next));
		});
	};
	const handleNextStage = () => {
		if (playerCol < COLS - 1) {
			setMessage("Finish the current journey first.");
			return;
		}
		if (stage >= MAX_STAGE) {
			setMessage("You have completed all 100 stages. Great job!");
			return;
		}
		const nextStage = stage + 1;
		setStage(nextStage);
		loadStage(nextStage);
	};
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "ArrowUp") {
				event.preventDefault();
				moveRow(-1);
			}
			if (event.key === "ArrowDown") {
				event.preventDefault();
				moveRow(1);
			}
			if (event.key === " " || event.key === "Enter") {
				event.preventDefault();
				advanceStep();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		playerRow,
		playerCol,
		grid
	]);
	const coinsLeft = Math.max(initialCoins - collected, 0);
	const isDirtyStage = stage >= 2;
	if (!Array.isArray(grid) || grid.length === 0) {
		return /* @__PURE__ */ _jsxDEV("main", {
			className: "app-shell",
			children: /* @__PURE__ */ _jsxDEV("section", {
				className: "game-panel",
				children: /* @__PURE__ */ _jsxDEV("div", {
					className: "panel-info",
					children: /* @__PURE__ */ _jsxDEV("p", { children: "Loading the game board..." }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 199,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 198,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 197,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 196,
			columnNumber: 7
		}, this);
	}
	return /* @__PURE__ */ _jsxDEV("main", {
		className: "app-shell",
		children: [
			/* @__PURE__ */ _jsxDEV("header", {
				className: "title-bar",
				children: [/* @__PURE__ */ _jsxDEV("div", { children: [
					/* @__PURE__ */ _jsxDEV("p", {
						className: "badge",
						children: "Journey Game"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 210,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("h1", { children: ["Stage ", stage] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 211,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("p", {
						className: "subtitle",
						children: stageLabel(stage)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 212,
						columnNumber: 11
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 209,
					columnNumber: 9
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "stats",
					children: [
						/* @__PURE__ */ _jsxDEV("div", { children: ["Score: ", score] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 215,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("div", { children: ["Coins left: ", coinsLeft] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 216,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("div", { children: isDirtyStage ? "Dirty path active" : "Clear road" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 217,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 214,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 208,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ _jsxDEV("section", {
				className: "game-panel",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "panel-info",
					children: [/* @__PURE__ */ _jsxDEV("p", { children: message }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 223,
						columnNumber: 11
					}, this), /* @__PURE__ */ _jsxDEV("p", {
						className: "hint",
						children: "Use arrow keys to move up/down. Press Space or Enter to step forward."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 224,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 222,
					columnNumber: 9
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "grid",
					role: "grid",
					"aria-label": "Journey game board",
					children: grid.map((row, rowIndex) => {
						const safeRow = Array.isArray(row) ? row : Array.from({ length: COLS }, () => ({
							type: "empty",
							dirty: false
						}));
						return /* @__PURE__ */ _jsxDEV("div", {
							className: "row",
							role: "row",
							children: safeRow.map((cell, colIndex) => {
								const safeCell = cell ?? {
									type: "empty",
									dirty: false
								};
								const isPlayer = playerRow === rowIndex && playerCol === colIndex;
								const isFinish = rowIndex === START_ROW && colIndex === COLS - 1;
								const cellClasses = [
									"cell",
									safeCell.type,
									safeCell.dirty ? "dirty" : "",
									isFinish ? "finish" : ""
								].filter(Boolean).join(" ");
								return /* @__PURE__ */ _jsxDEV("div", {
									className: cellClasses,
									role: "gridcell",
									children: [
										isPlayer && /* @__PURE__ */ _jsxDEV("div", { className: "player" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 250,
											columnNumber: 36
										}, this),
										safeCell.type === "coin" && /* @__PURE__ */ _jsxDEV("div", { className: "coin" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 251,
											columnNumber: 52
										}, this),
										safeCell.type === "obstacle" && /* @__PURE__ */ _jsxDEV("div", { className: "obstacle" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 252,
											columnNumber: 56
										}, this),
										isFinish && !isPlayer && /* @__PURE__ */ _jsxDEV("div", {
											className: "finish-flag",
											children: "🏁"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 253,
											columnNumber: 49
										}, this)
									]
								}, colIndex, true, {
									fileName: _jsxFileName,
									lineNumber: 249,
									columnNumber: 21
								}, this);
							})
						}, rowIndex, false, {
							fileName: _jsxFileName,
							lineNumber: 234,
							columnNumber: 15
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 227,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 221,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ _jsxDEV("footer", {
				className: "control-panel",
				children: [
					/* @__PURE__ */ _jsxDEV("button", {
						className: "game-button",
						onClick: () => moveRow(-1),
						children: "Move Up"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 264,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV("button", {
						className: "game-button accent",
						onClick: advanceStep,
						children: "Step Forward"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 267,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV("button", {
						className: "game-button",
						onClick: () => moveRow(1),
						children: "Move Down"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 270,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV("button", {
						className: "game-button next-stage",
						onClick: handleNextStage,
						children: "Next Stage"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 273,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 263,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 207,
		columnNumber: 5
	}, this);
}
_s(App, "mmBxmLJ9184kp4hRagD3IlQdL8o=");
_c = App;
export default App;
var _c;
$RefreshReg$(_c, "App");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/App.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/psml1/OneDrive/Documents/GitHub/API/journey-game/src/App.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/psml1/OneDrive/Documents/GitHub/API/journey-game/src/App.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "C:/Users/psml1/OneDrive/Documents/GitHub/API/journey-game/src/App.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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LE9BQU87UUFDL0QsTUFBTSxjQUFjO1NBQ2xCO1NBQ0EsU0FBUztTQUNULFNBQVMsUUFBUSxVQUFVO1NBQzNCLFdBQVcsV0FBVztTQUN2QixDQUNFLE9BQU8sUUFBUSxDQUNmLEtBQUssSUFBSTtBQUVaLGVBQ0Usd0JBQUMsT0FBRDtTQUFvQixXQUFXO1NBQWEsTUFBSzttQkFBakQ7VUFDRyxZQUFZLHdCQUFDLE9BQUQsRUFBSyxXQUFVLFVBQVc7Ozs7O1VBQ3RDLFNBQVMsU0FBUyxVQUFVLHdCQUFDLE9BQUQsRUFBSyxXQUFVLFFBQVM7Ozs7O1VBQ3BELFNBQVMsU0FBUyxjQUFjLHdCQUFDLE9BQUQsRUFBSyxXQUFVLFlBQWE7Ozs7O1VBQzVELFlBQVksQ0FBQyxZQUFZLHdCQUFDLE9BQUQ7V0FBSyxXQUFVO3FCQUFjO1dBQVE7Ozs7O1VBQzNEO1dBTEk7Ozs7Z0JBS0o7U0FFUjtPQUNFLEVBdkJJOzs7O2NBdUJKO09BRVI7S0FDRTs7OzthQUNFOzs7Ozs7R0FFVix3QkFBQyxVQUFEO0lBQVEsV0FBVTtjQUFsQjtLQUNFLHdCQUFDLFVBQUQ7TUFBUSxXQUFVO01BQWMsZUFBZSxRQUFRLENBQUMsRUFBRTtnQkFBRTtNQUVuRDs7Ozs7S0FDVCx3QkFBQyxVQUFEO01BQVEsV0FBVTtNQUFxQixTQUFTO2dCQUFhO01BRXBEOzs7OztLQUNULHdCQUFDLFVBQUQ7TUFBUSxXQUFVO01BQWMsZUFBZSxRQUFRLEVBQUU7Z0JBQUU7TUFFbEQ7Ozs7O0tBQ1Qsd0JBQUMsVUFBRDtNQUFRLFdBQVU7TUFBeUIsU0FBUztnQkFBaUI7TUFFNUQ7Ozs7O0tBQ0Y7Ozs7OztHQUNKOzs7Ozs7O3VDQUVWOztBQUVELGVBQWUiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiQXBwLmpzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgJy4vQXBwLmNzcydcblxuY29uc3QgUk9XUyA9IDVcbmNvbnN0IENPTFMgPSAxMlxuY29uc3QgU1RBUlRfUk9XID0gMlxuY29uc3QgTUFYX1NUQUdFID0gMTAwXG5cbmNvbnN0IHNlZWRSYW5kb20gPSAoc2VlZCkgPT4ge1xuICBsZXQgdmFsdWUgPSBzZWVkXG4gIHJldHVybiAoKSA9PiB7XG4gICAgdmFsdWUgPSBNYXRoLmltdWwoNDgyNzEsIHZhbHVlKSAlIDIxNDc0ODM2NDdcbiAgICByZXR1cm4gKHZhbHVlIC0gMSkgLyAyMTQ3NDgzNjQ2XG4gIH1cbn1cblxuY29uc3QgY3JlYXRlU3RhZ2UgPSAoc3RhZ2UpID0+IHtcbiAgY29uc3QgZ3JpZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IFJPV1MgfSwgKCkgPT5cbiAgICBBcnJheS5mcm9tKHsgbGVuZ3RoOiBDT0xTIH0sICgpID0+ICh7IHR5cGU6ICdlbXB0eScsIGRpcnR5OiBmYWxzZSB9KSlcbiAgKVxuXG4gIGNvbnN0IHJhbmRvbSA9IHNlZWRSYW5kb20oc3RhZ2UpXG4gIGNvbnN0IGNvaW5Db3VudCA9IE1hdGgubWluKDQgKyBNYXRoLmZsb29yKHN0YWdlIC8gMyksIDEyKVxuICBjb25zdCBvYnN0YWNsZUNvdW50ID0gTWF0aC5taW4oTWF0aC5mbG9vcihzdGFnZSAvIDIpLCAxNilcbiAgY29uc3QgZGlydENvdW50ID0gc3RhZ2UgPj0gMiA/IE1hdGgubWluKDMgKyBNYXRoLmZsb29yKHN0YWdlIC8gMyksIDE0KSA6IDBcblxuICBjb25zdCBwbGFjZUl0ZW1zID0gKGNvdW50LCBhc3NpZ24pID0+IHtcbiAgICBsZXQgcGxhY2VkID0gMFxuICAgIHdoaWxlIChwbGFjZWQgPCBjb3VudCkge1xuICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihyYW5kb20oKSAqIFJPV1MpXG4gICAgICBjb25zdCBjb2wgPSAxICsgTWF0aC5mbG9vcihyYW5kb20oKSAqIChDT0xTIC0gMikpXG4gICAgICBpZiAocm93ID09PSBTVEFSVF9ST1cgJiYgY29sID09PSBDT0xTIC0gMSkgY29udGludWVcbiAgICAgIGlmIChncmlkW3Jvd11bY29sXS50eXBlID09PSAnZW1wdHknKSB7XG4gICAgICAgIGFzc2lnbihncmlkW3Jvd11bY29sXSlcbiAgICAgICAgcGxhY2VkICs9IDFcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwbGFjZUl0ZW1zKGNvaW5Db3VudCwgKGNlbGwpID0+IHtcbiAgICBjZWxsLnR5cGUgPSAnY29pbidcbiAgfSlcblxuICBwbGFjZUl0ZW1zKG9ic3RhY2xlQ291bnQsIChjZWxsKSA9PiB7XG4gICAgY2VsbC50eXBlID0gJ29ic3RhY2xlJ1xuICB9KVxuXG4gIGxldCBwbGFjZWREaXJ0ID0gMFxuICB3aGlsZSAocGxhY2VkRGlydCA8IGRpcnRDb3VudCkge1xuICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IocmFuZG9tKCkgKiBST1dTKVxuICAgIGNvbnN0IGNvbCA9IDEgKyBNYXRoLmZsb29yKHJhbmRvbSgpICogKENPTFMgLSAyKSlcbiAgICBjb25zdCBjZWxsID0gZ3JpZFtyb3ddW2NvbF1cbiAgICBpZiAoY2VsbC50eXBlID09PSAnZW1wdHknICYmICFjZWxsLmRpcnR5KSB7XG4gICAgICBjZWxsLmRpcnR5ID0gdHJ1ZVxuICAgICAgcGxhY2VkRGlydCArPSAxXG4gICAgfVxuICB9XG5cbiAgZ3JpZFtTVEFSVF9ST1ddWzBdLnR5cGUgPSAnc3RhcnQnXG4gIGdyaWRbU1RBUlRfUk9XXVtDT0xTIC0gMV0udHlwZSA9ICdmaW5pc2gnXG4gIHJldHVybiBncmlkXG59XG5cbmNvbnN0IHN0YWdlTGFiZWwgPSAoc3RhZ2UpID0+IHtcbiAgaWYgKHN0YWdlID09PSAxKSByZXR1cm4gJ0NsZWFuIGZpcnN0IGpvdXJuZXknXG4gIGlmIChzdGFnZSA9PT0gMikgcmV0dXJuICdEaXJ0eSB3YXkgd2l0aCBwdWRkbGVzJ1xuICBpZiAoc3RhZ2UgPD0gNSkgcmV0dXJuICdNb3JlIG9ic3RhY2xlcyBhcHBlYXInXG4gIGlmIChzdGFnZSA8PSAyMCkgcmV0dXJuICdSb3VnaCByb3V0ZSBhbmQgZmFzdGVyIGNvaW5zJ1xuICByZXR1cm4gJ01hc3RlciB0aGUgam91cm5leSdcbn1cblxuY29uc3QgaXNWYWxpZEdyaWQgPSAoZ3JpZCkgPT5cbiAgQXJyYXkuaXNBcnJheShncmlkKSAmJlxuICBncmlkLmxlbmd0aCA9PT0gUk9XUyAmJlxuICBncmlkLmV2ZXJ5KChyb3cpID0+IEFycmF5LmlzQXJyYXkocm93KSAmJiByb3cubGVuZ3RoID09PSBDT0xTKVxuXG5mdW5jdGlvbiBBcHAoKSB7XG4gIGNvbnN0IFtzdGFnZSwgc2V0U3RhZ2VdID0gdXNlU3RhdGUoMSlcbiAgY29uc3QgW3Njb3JlLCBzZXRTY29yZV0gPSB1c2VTdGF0ZSgwKVxuICBjb25zdCBbcGxheWVyUm93LCBzZXRQbGF5ZXJSb3ddID0gdXNlU3RhdGUoU1RBUlRfUk9XKVxuICBjb25zdCBbcGxheWVyQ29sLCBzZXRQbGF5ZXJDb2xdID0gdXNlU3RhdGUoMClcbiAgY29uc3QgW2dyaWQsIHNldEdyaWRdID0gdXNlU3RhdGUoKCkgPT4gY3JlYXRlU3RhZ2UoMSkpXG4gIGNvbnN0IFtpbml0aWFsQ29pbnMsIHNldEluaXRpYWxDb2luc10gPSB1c2VTdGF0ZSgwKVxuICBjb25zdCBbY29sbGVjdGVkLCBzZXRDb2xsZWN0ZWRdID0gdXNlU3RhdGUoMClcbiAgY29uc3QgW21lc3NhZ2UsIHNldE1lc3NhZ2VdID0gdXNlU3RhdGUoJ1VzZSBBcnJvdyBVcC9Eb3duIGFuZCBTcGFjZSB0byBtb3ZlLicpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBuZXh0R3JpZCA9IGNyZWF0ZVN0YWdlKDEpXG4gICAgc2V0R3JpZChuZXh0R3JpZClcbiAgICBzZXRJbml0aWFsQ29pbnMobmV4dEdyaWQuZmxhdCgpLmZpbHRlcigoY2VsbCkgPT4gY2VsbC50eXBlID09PSAnY29pbicpLmxlbmd0aClcbiAgfSwgW10pXG5cbiAgY29uc3QgbG9hZFN0YWdlID0gKG5leHRTdGFnZSkgPT4ge1xuICAgIGNvbnN0IG5leHRHcmlkID0gY3JlYXRlU3RhZ2UobmV4dFN0YWdlKVxuICAgIHNldEdyaWQobmV4dEdyaWQpXG4gICAgc2V0UGxheWVyUm93KFNUQVJUX1JPVylcbiAgICBzZXRQbGF5ZXJDb2woMClcbiAgICBzZXRDb2xsZWN0ZWQoMClcbiAgICBzZXRJbml0aWFsQ29pbnMobmV4dEdyaWQuZmxhdCgpLmZpbHRlcigoY2VsbCkgPT4gY2VsbC50eXBlID09PSAnY29pbicpLmxlbmd0aClcbiAgICBzZXRNZXNzYWdlKGBTdGFnZSAke25leHRTdGFnZX06ICR7c3RhZ2VMYWJlbChuZXh0U3RhZ2UpfS4gQ29sbGVjdCBjb2lucyBhbmQgcmVhY2ggZmluaXNoLmApXG4gIH1cblxuICBjb25zdCByZXN0YXJ0U3RhZ2UgPSAoKSA9PiB7XG4gICAgc2V0TWVzc2FnZSgnT29wcyEgWW91IGhpdCBhbiBvYnN0YWNsZS4gUmVzdGFydGluZyB0aGlzIHN0YWdlLi4uJylcbiAgICBzZXRUaW1lb3V0KCgpID0+IGxvYWRTdGFnZShzdGFnZSksIDYwMClcbiAgfVxuXG4gIGNvbnN0IGFkdmFuY2VTdGVwID0gKCkgPT4ge1xuICAgIGlmICghaXNWYWxpZEdyaWQoZ3JpZCkgfHwgcGxheWVyUm93IDwgMCB8fCBwbGF5ZXJSb3cgPj0gUk9XUykge1xuICAgICAgc2V0TWVzc2FnZSgnVW5hYmxlIHRvIG1vdmU6IGJvYXJkIGlzIG5vdCByZWFkeSB5ZXQuJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChwbGF5ZXJDb2wgPj0gQ09MUyAtIDEpIHJldHVyblxuICAgIGNvbnN0IG5leHRDb2wgPSBwbGF5ZXJDb2wgKyAxXG4gICAgY29uc3QgdGFyZ2V0ID0gZ3JpZFtwbGF5ZXJSb3ddPy5bbmV4dENvbF1cblxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICBzZXRNZXNzYWdlKCdVbmFibGUgdG8gbW92ZTogaW52YWxpZCBib2FyZCBwb3NpdGlvbi4nKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRhcmdldC50eXBlID09PSAnb2JzdGFjbGUnKSB7XG4gICAgICByZXN0YXJ0U3RhZ2UoKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRhcmdldC50eXBlID09PSAnY29pbicpIHtcbiAgICAgIHNldFNjb3JlKCh2YWx1ZSkgPT4gdmFsdWUgKyAxMClcbiAgICAgIHNldENvbGxlY3RlZCgodmFsdWUpID0+IHZhbHVlICsgMSlcbiAgICAgIHNldE1lc3NhZ2UoJ05pY2UhIFlvdSBjb2xsZWN0ZWQgYSBjb2luLicpXG4gICAgICBzZXRHcmlkKChjdXJyZW50R3JpZCkgPT5cbiAgICAgICAgY3VycmVudEdyaWQubWFwKChyb3csIHJvd0luZGV4KSA9PlxuICAgICAgICAgIHJvdy5tYXAoKGNlbGwsIGNvbEluZGV4KSA9PlxuICAgICAgICAgICAgcm93SW5kZXggPT09IHBsYXllclJvdyAmJiBjb2xJbmRleCA9PT0gbmV4dENvbFxuICAgICAgICAgICAgICA/IHsgLi4uY2VsbCwgdHlwZTogJ2VtcHR5JyB9XG4gICAgICAgICAgICAgIDogY2VsbFxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgIH1cblxuICAgIHNldFBsYXllckNvbChuZXh0Q29sKVxuXG4gICAgaWYgKG5leHRDb2wgPT09IENPTFMgLSAxKSB7XG4gICAgICBzZXRNZXNzYWdlKCdTdGFnZSBjb21wbGV0ZSEgVGFwIE5leHQgU3RhZ2UgdG8gY29udGludWUuJylcbiAgICB9XG4gIH1cblxuICBjb25zdCBtb3ZlUm93ID0gKGRpcmVjdGlvbikgPT4ge1xuICAgIHNldFBsYXllclJvdygoY3VycmVudCkgPT4ge1xuICAgICAgY29uc3QgbmV4dCA9IGN1cnJlbnQgKyBkaXJlY3Rpb25cbiAgICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbihST1dTIC0gMSwgbmV4dCkpXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZU5leHRTdGFnZSA9ICgpID0+IHtcbiAgICBpZiAocGxheWVyQ29sIDwgQ09MUyAtIDEpIHtcbiAgICAgIHNldE1lc3NhZ2UoJ0ZpbmlzaCB0aGUgY3VycmVudCBqb3VybmV5IGZpcnN0LicpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHN0YWdlID49IE1BWF9TVEFHRSkge1xuICAgICAgc2V0TWVzc2FnZSgnWW91IGhhdmUgY29tcGxldGVkIGFsbCAxMDAgc3RhZ2VzLiBHcmVhdCBqb2IhJylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBuZXh0U3RhZ2UgPSBzdGFnZSArIDFcbiAgICBzZXRTdGFnZShuZXh0U3RhZ2UpXG4gICAgbG9hZFN0YWdlKG5leHRTdGFnZSlcbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaGFuZGxlS2V5RG93biA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93VXAnKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgbW92ZVJvdygtMSlcbiAgICAgIH1cbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdBcnJvd0Rvd24nKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgbW92ZVJvdygxKVxuICAgICAgfVxuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJyAnIHx8IGV2ZW50LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGFkdmFuY2VTdGVwKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pXG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bilcbiAgfSwgW3BsYXllclJvdywgcGxheWVyQ29sLCBncmlkXSlcblxuICBjb25zdCBjb2luc0xlZnQgPSBNYXRoLm1heChpbml0aWFsQ29pbnMgLSBjb2xsZWN0ZWQsIDApXG4gIGNvbnN0IGlzRGlydHlTdGFnZSA9IHN0YWdlID49IDJcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZ3JpZCkgfHwgZ3JpZC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gKFxuICAgICAgPG1haW4gY2xhc3NOYW1lPVwiYXBwLXNoZWxsXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImdhbWUtcGFuZWxcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWluZm9cIj5cbiAgICAgICAgICAgIDxwPkxvYWRpbmcgdGhlIGdhbWUgYm9hcmQuLi48L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvbWFpbj5cbiAgICApXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxtYWluIGNsYXNzTmFtZT1cImFwcC1zaGVsbFwiPlxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJ0aXRsZS1iYXJcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJiYWRnZVwiPkpvdXJuZXkgR2FtZTwvcD5cbiAgICAgICAgICA8aDE+U3RhZ2Uge3N0YWdlfTwvaDE+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwic3VidGl0bGVcIj57c3RhZ2VMYWJlbChzdGFnZSl9PC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGF0c1wiPlxuICAgICAgICAgIDxkaXY+U2NvcmU6IHtzY29yZX08L2Rpdj5cbiAgICAgICAgICA8ZGl2PkNvaW5zIGxlZnQ6IHtjb2luc0xlZnR9PC9kaXY+XG4gICAgICAgICAgPGRpdj57aXNEaXJ0eVN0YWdlID8gJ0RpcnR5IHBhdGggYWN0aXZlJyA6ICdDbGVhciByb2FkJ308L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2hlYWRlcj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiZ2FtZS1wYW5lbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWluZm9cIj5cbiAgICAgICAgICA8cD57bWVzc2FnZX08L3A+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiaGludFwiPlVzZSBhcnJvdyBrZXlzIHRvIG1vdmUgdXAvZG93bi4gUHJlc3MgU3BhY2Ugb3IgRW50ZXIgdG8gc3RlcCBmb3J3YXJkLjwvcD5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkXCIgcm9sZT1cImdyaWRcIiBhcmlhLWxhYmVsPVwiSm91cm5leSBnYW1lIGJvYXJkXCI+XG4gICAgICAgICAge2dyaWQubWFwKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzYWZlUm93ID0gQXJyYXkuaXNBcnJheShyb3cpXG4gICAgICAgICAgICAgID8gcm93XG4gICAgICAgICAgICAgIDogQXJyYXkuZnJvbSh7IGxlbmd0aDogQ09MUyB9LCAoKSA9PiAoeyB0eXBlOiAnZW1wdHknLCBkaXJ0eTogZmFsc2UgfSkpXG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxkaXYga2V5PXtyb3dJbmRleH0gY2xhc3NOYW1lPVwicm93XCIgcm9sZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIHtzYWZlUm93Lm1hcCgoY2VsbCwgY29sSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHNhZmVDZWxsID0gY2VsbCA/PyB7IHR5cGU6ICdlbXB0eScsIGRpcnR5OiBmYWxzZSB9XG4gICAgICAgICAgICAgICAgICBjb25zdCBpc1BsYXllciA9IHBsYXllclJvdyA9PT0gcm93SW5kZXggJiYgcGxheWVyQ29sID09PSBjb2xJbmRleFxuICAgICAgICAgICAgICAgICAgY29uc3QgaXNGaW5pc2ggPSByb3dJbmRleCA9PT0gU1RBUlRfUk9XICYmIGNvbEluZGV4ID09PSBDT0xTIC0gMVxuICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbENsYXNzZXMgPSBbXG4gICAgICAgICAgICAgICAgICAgICdjZWxsJyxcbiAgICAgICAgICAgICAgICAgICAgc2FmZUNlbGwudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgc2FmZUNlbGwuZGlydHkgPyAnZGlydHknIDogJycsXG4gICAgICAgICAgICAgICAgICAgIGlzRmluaXNoID8gJ2ZpbmlzaCcgOiAnJyxcbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAgICAgICAgICAgICAuam9pbignICcpXG5cbiAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtjb2xJbmRleH0gY2xhc3NOYW1lPXtjZWxsQ2xhc3Nlc30gcm9sZT1cImdyaWRjZWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAge2lzUGxheWVyICYmIDxkaXYgY2xhc3NOYW1lPVwicGxheWVyXCIgLz59XG4gICAgICAgICAgICAgICAgICAgICAge3NhZmVDZWxsLnR5cGUgPT09ICdjb2luJyAmJiA8ZGl2IGNsYXNzTmFtZT1cImNvaW5cIiAvPn1cbiAgICAgICAgICAgICAgICAgICAgICB7c2FmZUNlbGwudHlwZSA9PT0gJ29ic3RhY2xlJyAmJiA8ZGl2IGNsYXNzTmFtZT1cIm9ic3RhY2xlXCIgLz59XG4gICAgICAgICAgICAgICAgICAgICAge2lzRmluaXNoICYmICFpc1BsYXllciAmJiA8ZGl2IGNsYXNzTmFtZT1cImZpbmlzaC1mbGFnXCI+8J+PgTwvZGl2Pn1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPGZvb3RlciBjbGFzc05hbWU9XCJjb250cm9sLXBhbmVsXCI+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2FtZS1idXR0b25cIiBvbkNsaWNrPXsoKSA9PiBtb3ZlUm93KC0xKX0+XG4gICAgICAgICAgTW92ZSBVcFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnYW1lLWJ1dHRvbiBhY2NlbnRcIiBvbkNsaWNrPXthZHZhbmNlU3RlcH0+XG4gICAgICAgICAgU3RlcCBGb3J3YXJkXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdhbWUtYnV0dG9uXCIgb25DbGljaz17KCkgPT4gbW92ZVJvdygxKX0+XG4gICAgICAgICAgTW92ZSBEb3duXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdhbWUtYnV0dG9uIG5leHQtc3RhZ2VcIiBvbkNsaWNrPXtoYW5kbGVOZXh0U3RhZ2V9PlxuICAgICAgICAgIE5leHQgU3RhZ2VcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Zvb3Rlcj5cbiAgICA8L21haW4+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwXG4iXX0=