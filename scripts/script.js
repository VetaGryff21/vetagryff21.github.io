var k, j, I_Start, J_Start, I_End, J_End, I_Dir, J_Dir;
var StepCounter, StepTime, StepStat, CountGame;
var Colour, IsOver, Size = 9, Start = 1, GlobalDepth = 1, D_Sel, GColour;

IsPlayer = new Array(2);
IsPlayer[0] = false;
IsPlayer[1] = true;

Board = new Array(Size);
for (k = 0; k < Size; k++) {
    Board[k] = new Array(Size);
}

TBoard = new Array(Size);
for (k = 0; k < Size; k++) {
    TBoard[k] = new Array(Size);
}

CBoard = new Array(6);
for (k = 0; k < 6; k++) {
    CBoard[k] = new Array(2);
}
{
    CI = new Array(24);
    CJ = new Array(24);
    CI[0] = [4, -1, 0, 1];
    CI[1] = [5, -1, 0];
    CI[2] = [6, -1, 0];
    CI[3] = [7, -1, 0];
    CI[4] = [8, -1, -1, 0];
    CI[5] = [8, -1, -1];
    CI[6] = [8, -1, -1];
    CI[7] = [8, -1, -1];
    CI[8] = [8, 0, -1, -1];
    CI[9] = [7, 0, -1];
    CI[10] = [6, 0, -1];
    CI[11] = [5, 0, -1];
    CI[12] = [4, 1, 0, -1];
    CI[13] = [3, 1, 0];
    CI[14] = [2, 1, 0];
    CI[15] = [1, 1, 0];
    CI[16] = [0, 1, 1, 0];
    CI[17] = [0, 1, 1];
    CI[18] = [0, 1, 1];
    CI[19] = [0, 1, 1];
    CI[20] = [0, 0, 1, 1];
    CI[21] = [1, 0, 1];
    CI[22] = [2, 0, 1];
    CI[23] = [3, 0, 1];
    CJ[0] = [0, 1, 1, 0];
    CJ[1] = [0, 1, 1];
    CJ[2] = [0, 1, 1];
    CJ[3] = [0, 1, 1];
    CJ[4] = [0, 0, 1, 1];
    CJ[5] = [1, 0, 1];
    CJ[6] = [2, 0, 1];
    CJ[7] = [3, 0, 1];
    CJ[8] = [4, -1, 0, 1];
    CJ[9] = [5, -1, 0];
    CJ[10] = [6, -1, 0];
    CJ[11] = [7, -1, 0];
    CJ[12] = [8, -1, -1, 0];
    CJ[13] = [8, -1, -1];
    CJ[14] = [8, -1, -1];
    CJ[15] = [8, -1, -1];
    CJ[16] = [8, 0, -1, -1];
    CJ[17] = [7, 0, -1];
    CJ[18] = [6, 0, -1];
    CJ[19] = [5, 0, -1];
    CJ[20] = [4, 1, 0, -1];
    CJ[21] = [3, 1, 0];
    CJ[22] = [2, 1, 0];
    CJ[23] = [1, 1, 0];


}

Images = new Array(6);
for (k = 0; k < 6; k++) {
    Images[k] = new Image();
    Images[k].src = "./images/ball" + k + ".png";
}

function SetPlayer() {
    var players = +document.myform.players.value;
    if (players == 11) {
        IsPlayer[0] = true;
        IsPlayer[1] = true;
    }
    if (players == 10) {
        IsPlayer[0] = false;
        IsPlayer[1] = true;
    }
    I_Start = -1;
    J_Start = -1;
    I_End = -1;
    J_End = -1;
    RefreshScreen();
}

function Init() {
    var i, j;
    for (j = 0; j < Size; j++) {  // расставить -2 на неисп. и -1 на остальные клетки
        for (i = 0; i < Size; i++) {
            if ((i + j < 4) || (i + j) > 12) Board[i][j] = -2;
            else Board[i][j] = -1;
        }
    }
    for (i = 0; i < 5; i++) { // расставить шары разных цветов (по линиям)
        Board[i + 4][0] = 0;
        Board[i][8] = 1;
    }
    for (i = 0; i < 6; i++) {
        Board[i + 3][1] = 0;
        Board[i][7] = 1;
    }
    for (i = 0; i < 3; i++) {
        Board[i + 4][2] = 0;
        Board[i + 2][6] = 1;
    }
    for (i = 0; i < 6; i++) {
        CBoard[i][0] = -1;
        CBoard[i][1] = -1;
    }
    I_Start = -1;
    J_Start = -1;
    I_End = -1;
    J_End = -1;
    IsOver = 0;
    D_Sel = -1;
    Colour = Start;
    StepCounter = 0;
    StepTime = 0;
    RefreshScreen();
    for (i = 0; i < 6; i++) {  // бесцветные заглушки на места вытолкнутых шаров
        document.images[i].src = Images[5].src;
        document.images[i + 67].src = Images[5].src;
    }
}

function Timer() {
    if (IsOver) return;
    if (IsPlayer[Colour]) return;
    if (I_Start === -1) {

        var t1 = performance.now();
        GetBestMoveMin(Colour);
        var t2 = performance.now();
        StepTime += t2 - t1;

        document.images[ImgNum(I_Start, J_Start)].src = Images[Colour + 3].src;
        if (I_End > 0) {
            document.images[ImgNum(I_End, J_End)].src = Images[Colour + 3].src;
            if ((Math.abs(I_Start - I_End) == 2) || (Math.abs(J_Start - J_End) == 2))
                document.images[ImgNum((I_Start + I_End) / 2, (J_Start + J_End) / 2)].src = Images[Colour + 3].src;
        }
        return;
    }
    MakeMove(I_Dir, J_Dir, true); // переставить шарик(и)
    StepCounter++;

    OverTest(Colour, true); // проверка на конец игры

    I_Start = -1;
    J_Start = -1;
    I_End = -1;
    J_End = -1;
    Colour = 1 - Colour; //смена хода
    GetCBoard();
}

function ImgNum(vi, vj) {
    var i, j, n = 6;
    for (j = 0; j < Size; j++) {
        for (i = 0; i < Size; i++) {
            if ((i === vi) && (j === vj)) return (n);
            if (Board[i][j] > -2) n++;
        }
    }
    return (0);
}

function GetBoard(nn, color) {  // какой элемент в этой ячейке?
    if (nn < 0) return (-2);
    if (nn >= Size) return (-2);
    if (color < 0) return (-2);
    if (color >= Size) return (-2);
    return (Board[nn][color]);
}

function GetCBoard() {
    var i;
    for (i = 0; i < 6; i++) { // начальное заполнение -1
        CBoard[i][0] = -1;
        CBoard[i][1] = -1;
    }
    if (I_Start < 0) return; // если начальной координаты шарика (группы) нет, то выход
    if (I_End < 0) {  //если конечной координаты нет
        if (GetBoard(I_Start + 1, J_Start) == -1) {
            CBoard[0][0] = I_Start + 1;
            CBoard[0][1] = J_Start;
        }
        if (GetBoard(I_Start, J_Start + 1) == -1) {
            CBoard[1][0] = I_Start;
            CBoard[1][1] = J_Start + 1;
        }
        if (GetBoard(I_Start - 1, J_Start + 1) == -1) {
            CBoard[2][0] = I_Start - 1;
            CBoard[2][1] = J_Start + 1;
        }
        if (GetBoard(I_Start - 1, J_Start) == -1) {
            CBoard[3][0] = I_Start - 1;
            CBoard[3][1] = J_Start;
        }
        if (GetBoard(I_Start, J_Start - 1) == -1) {
            CBoard[4][0] = I_Start;
            CBoard[4][1] = J_Start - 1;
        }
        if (GetBoard(I_Start + 1, J_Start - 1) == -1) {
            CBoard[5][0] = I_Start + 1;
            CBoard[5][1] = J_Start - 1;
        }
        return;
    }
    if (CanMove(1, 0)) {
        if (2 * I_Start + J_Start > 2 * I_End + J_End) {
            CBoard[0][0] = I_Start + 1;
            CBoard[0][1] = J_Start;
        } else {
            CBoard[0][0] = I_End + 1;
            CBoard[0][1] = J_End;
        }
    }
    if (CanMove(0, 1)) {
        if (I_Start + 2 * J_Start > I_End + 2 * J_End) {
            CBoard[1][0] = I_Start;
            CBoard[1][1] = J_Start + 1;
        } else {
            CBoard[1][0] = I_End;
            CBoard[1][1] = J_End + 1;
        }
    }
    if (CanMove(-1, 1)) {
        if (-I_Start + 2 * J_Start > -I_End + 2 * J_End) {
            CBoard[2][0] = I_Start - 1;
            CBoard[2][1] = J_Start + 1;
        } else {
            CBoard[2][0] = I_End - 1;
            CBoard[2][1] = J_End + 1;
        }
    }
    if (CanMove(-1, 0)) {
        if (2 * I_Start + J_Start < 2 * I_End + J_End) {
            CBoard[3][0] = I_Start - 1;
            CBoard[3][1] = J_Start;
        } else {
            CBoard[3][0] = I_End - 1;
            CBoard[3][1] = J_End;
        }
    }
    if (CanMove(0, -1)) {
        if (I_Start + 2 * J_Start < I_End + 2 * J_End) {
            CBoard[4][0] = I_Start;
            CBoard[4][1] = J_Start - 1;
        } else {
            CBoard[4][0] = I_End;
            CBoard[4][1] = J_End - 1;
        }
    }
    if (CanMove(1, -1)) {
        if (I_Start - 2 * J_Start > I_End - 2 * J_End) {
            CBoard[5][0] = I_Start + 1;
            CBoard[5][1] = J_Start - 1;
        } else {
            CBoard[5][0] = I_End + 1;
            CBoard[5][1] = J_End - 1;
        }
    }
}

function CanMove(i, j) {
    var tmp;
    if (I_End < 0) {
        if (GetBoard(I_Start + i, J_Start + j) === -1) return (true);
        return (false);
    }
    if ((Math.abs(I_Start - I_End) === 1) || (Math.abs(J_Start - J_End) === 1)) {
        if ((I_Start - I_End === i) && (J_Start - J_End === j)) {
            tmp = GetBoard(I_Start + i, J_Start + j);
            if ((tmp === -1) || ((tmp === 1 - Colour) && (GetBoard(I_Start + 2 * i, J_Start + 2 * j) < 0)))
                return (true);
            return (false);
        }
        if ((I_End - I_Start === i) && (J_End - J_Start === j)) {
            tmp = GetBoard(I_End + i, J_End + j);
            if ((tmp === -1) || ((tmp === 1 - Colour) && (GetBoard(I_End + 2 * i, J_End + 2 * j) < 0)))
                return (true);
            return (false);
        }
        if ((GetBoard(I_Start + i, J_Start + j) === -1) && (GetBoard(I_End + i, J_End + j) === -1))
            return (true);
        return (false);
    }
    if ((Math.abs(I_Start - I_End) === 2) || (Math.abs(J_Start - J_End) === 2)) {
        if ((I_Start - I_End === 2 * i) && (J_Start - J_End === 2 * j)) {
            tmp = GetBoard(I_Start + i, J_Start + j);
            if (tmp === -1) return (true);
            if (tmp !== 1 - Colour) return (false);
            tmp = GetBoard(I_Start + 2 * i, J_Start + 2 * j);
            if ((tmp < 0) || ((tmp === 1 - Colour) && (GetBoard(I_Start + 3 * i, J_Start + 3 * j) < 0)))
                return (true);
            return (false);
        }
        if ((I_End - I_Start === 2 * i) && (J_End - J_Start === 2 * j)) {
            tmp = GetBoard(I_End + i, J_End + j);
            if (tmp === -1) return (true);
            if (tmp !== 1 - Colour) return (false);
            tmp = GetBoard(I_End + 2 * i, J_End + 2 * j);
            if ((tmp < 0) || ((tmp === 1 - Colour) && (GetBoard(I_End + 3 * i, J_End + 3 * j) < 0)))
                return (true);
            return (false);
        }
        if ((GetBoard(I_Start + i, J_Start + j) === -1) && (GetBoard(I_End + i, J_End + j) === -1)
            && (GetBoard((I_Start + I_End) / 2 + i, (J_Start + J_End) / 2 + j) === -1))
            return (true);
        return (false);
    }
}

function MakeMove(i, j, s) {
    var tmp;
    if (I_End < 0) { //если шарик одиночный(?)
        if (GetBoard(I_Start + i, J_Start + j) === -1) { //если на поле никого
            Board[I_Start + i][J_Start + j] = Colour;
            Board[I_Start][J_Start] = -1;
            if (s) {
                document.images[ImgNum(I_Start + i, J_Start + j)].src = Images[Colour + 1].src;
                document.images[ImgNum(I_Start, J_Start)].src = Images[0].src;
            }
            return (1);
        }
        return (0);
    }
    if ((Math.abs(I_Start - I_End) == 1) || (Math.abs(J_Start - J_End) == 1)) { //если группа 2 шариков
        if ((I_Start - I_End == i) && (J_Start - J_End == j)) {
            tmp = GetBoard(I_Start + i, J_Start + j);
            if (tmp == -1) {
                Board[I_Start + i][J_Start + j] = Colour;
                Board[I_End][J_End] = -1;
                if (s) {
                    document.images[ImgNum(I_Start + i, J_Start + j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_Start, J_Start)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_End, J_End)].src = Images[0].src;
                }
                return (1);
            }
            if (tmp != 1 - Colour) return (0);
            tmp = GetBoard(I_Start + 2 * i, J_Start + 2 * j);
            if (tmp < 0) {
                if (tmp == -1) Board[I_Start + 2 * i][J_Start + 2 * j] = 1 - Colour;
                Board[I_Start + i][J_Start + j] = Colour;
                Board[I_End][J_End] = -1;
                if (s) {
                    if (tmp == -1) document.images[ImgNum(I_Start + 2 * i, J_Start + 2 * j)].src = Images[2 - Colour].src;
                    document.images[ImgNum(I_Start + i, J_Start + j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_Start, J_Start)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_End, J_End)].src = Images[0].src;
                }
                return (-tmp);
            }
            return (0);
        }
        if ((I_End - I_Start == i) && (J_End - J_Start == j)) {
            tmp = GetBoard(I_End + i, J_End + j);
            if (tmp == -1) {
                Board[I_End + i][J_End + j] = Colour;
                Board[I_Start][J_Start] = -1;
                if (s) {
                    document.images[ImgNum(I_End + i, J_End + j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_End, J_End)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_Start, J_Start)].src = Images[0].src;
                }
                return (1);
            }
            if (tmp != 1 - Colour) return (0);
            tmp = GetBoard(I_End + 2 * i, J_End + 2 * j);
            if (tmp < 0) {
                if (tmp == -1) Board[I_End + 2 * i][J_End + 2 * j] = 1 - Colour;
                Board[I_End + i][J_End + j] = Colour;
                Board[I_Start][J_Start] = -1;
                if (s) {
                    if (tmp == -1) document.images[ImgNum(I_End + 2 * i, J_End + 2 * j)].src = Images[2 - Colour].src;
                    document.images[ImgNum(I_End + i, J_End + j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_End, J_End)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_Start, J_Start)].src = Images[0].src;
                }
                return (-tmp);
            }
            return (0);
        }
        if ((GetBoard(I_Start + i, J_Start + j) === -1) && (GetBoard(I_End + i, J_End + j) === -1)) {
            Board[I_Start + i][J_Start + j] = Colour;
            Board[I_Start][J_Start] = -1;
            Board[I_End + i][J_End + j] = Colour;
            Board[I_End][J_End] = -1;
            if (s) {
                document.images[ImgNum(I_Start + i, J_Start + j)].src = Images[Colour + 1].src;
                document.images[ImgNum(I_Start, J_Start)].src = Images[0].src;
                document.images[ImgNum(I_End + i, J_End + j)].src = Images[Colour + 1].src;
                document.images[ImgNum(I_End, J_End)].src = Images[0].src;
            }
            return (1);
        }
        return (0);
    }
    if ((Math.abs(I_Start - I_End) === 2) || (Math.abs(J_Start - J_End) === 2)) {
        if ((I_Start - I_End === 2 * i) && (J_Start - J_End === 2 * j)) {
            tmp = GetBoard(I_Start + i, J_Start + j);
            if (tmp === -1) {
                Board[I_Start + i][J_Start + j] = Colour;
                Board[I_End][J_End] = -1;
                if (s) {
                    document.images[ImgNum(I_Start + i, J_Start + j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_Start, J_Start)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_Start - i, J_Start - j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_End, J_End)].src = Images[0].src;
                }
                return (1);
            }
            if (tmp !== 1 - Colour) return (0);
            tmp = GetBoard(I_Start + 2 * i, J_Start + 2 * j);
            if (tmp < 0) {
                if (tmp === -1) Board[I_Start + 2 * i][J_Start + 2 * j] = 1 - Colour;
                Board[I_Start + i][J_Start + j] = Colour;
                Board[I_End][J_End] = -1;
                if (s) {
                    if (tmp === -1) document.images[ImgNum(I_Start + 2 * i, J_Start + 2 * j)].src = Images[2 - Colour].src;
                    document.images[ImgNum(I_Start + i, J_Start + j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_Start, J_Start)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_Start - i, J_Start - j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_End, J_End)].src = Images[0].src;
                }
                return (-tmp);
            }
            if (tmp !== 1 - Colour) return (0);
            tmp = GetBoard(I_Start + 3 * i, J_Start + 3 * j);
            if (tmp < 0) {
                if (tmp == -1) Board[I_Start + 3 * i][J_Start + 3 * j] = 1 - Colour;
                Board[I_Start + i][J_Start + j] = Colour;
                Board[I_End][J_End] = -1;
                if (s) {
                    if (tmp === -1) document.images[ImgNum(I_Start + 3 * i, J_Start + 3 * j)].src = Images[2 - Colour].src;
                    document.images[ImgNum(I_Start + i, J_Start + j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_Start, J_Start)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_Start - i, J_Start - j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_End, J_End)].src = Images[0].src;
                }
                return (-tmp);
            }
            return (0);
        }
        if ((I_End - I_Start == 2 * i) && (J_End - J_Start == 2 * j)) {
            tmp = GetBoard(I_End + i, J_End + j);
            if (tmp == -1) {
                Board[I_End + i][J_End + j] = Colour;
                Board[I_Start][J_Start] = -1;
                if (s) {
                    document.images[ImgNum(I_End + i, J_End + j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_End, J_End)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_End - i, J_End - j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_Start, J_Start)].src = Images[0].src;
                }
                return (1);
            }
            if (tmp != 1 - Colour) return (0);
            tmp = GetBoard(I_End + 2 * i, J_End + 2 * j);
            if (tmp < 0) {
                if (tmp == -1) Board[I_End + 2 * i][J_End + 2 * j] = 1 - Colour;
                Board[I_End + i][J_End + j] = Colour;
                Board[I_Start][J_Start] = -1;
                if (s) {
                    if (tmp == -1) document.images[ImgNum(I_End + 2 * i, J_End + 2 * j)].src = Images[2 - Colour].src;
                    document.images[ImgNum(I_End + i, J_End + j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_End, J_End)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_End - i, J_End - j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_Start, J_Start)].src = Images[0].src;
                }
                return (-tmp);
            }
            if (tmp != 1 - Colour) return (0);
            tmp = GetBoard(I_End + 3 * i, J_End + 3 * j);
            if (tmp < 0) {
                if (tmp == -1) Board[I_End + 3 * i][J_End + 3 * j] = 1 - Colour;
                Board[I_End + i][J_End + j] = Colour;
                Board[I_Start][J_Start] = -1;
                if (s) {
                    if (tmp == -1) document.images[ImgNum(I_End + 3 * i, J_End + 3 * j)].src = Images[2 - Colour].src;
                    document.images[ImgNum(I_End + i, J_End + j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_End, J_End)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_End - i, J_End - j)].src = Images[Colour + 1].src;
                    document.images[ImgNum(I_Start, J_Start)].src = Images[0].src;
                }
                return (-tmp);
            }
            return (0);
        }
        if ((GetBoard(I_Start + i, J_Start + j) == -1) && (GetBoard(I_End + i, J_End + j) == -1)
            && (GetBoard((I_Start + I_End) / 2 + i, (J_Start + J_End) / 2 + j) == -1)) {
            Board[I_Start + i][J_Start + j] = Colour;
            Board[I_Start][J_Start] = -1;
            Board[I_End + i][J_End + j] = Colour;
            Board[I_End][J_End] = -1;
            Board[(I_Start + I_End) / 2 + i][(J_Start + J_End) / 2 + j] = Colour;
            Board[(I_Start + I_End) / 2][(J_Start + J_End) / 2] = -1;
            if (s) {
                document.images[ImgNum(I_Start + i, J_Start + j)].src = Images[Colour + 1].src;
                document.images[ImgNum(I_Start, J_Start)].src = Images[0].src;
                document.images[ImgNum(I_End + i, J_End + j)].src = Images[Colour + 1].src;
                document.images[ImgNum(I_End, J_End)].src = Images[0].src;
                document.images[ImgNum((I_Start + I_End) / 2 + i, (J_Start + J_End) / 2 + j)].src = Images[Colour + 1].src;
                document.images[ImgNum((I_Start + I_End) / 2, (J_Start + J_End) / 2)].src = Images[0].src;
            }
            return (1);
        }
        return (0);
    }
}

function MouseDown(i, j) {
    var n, color = -1;
    if (IsOver > 0) return;
    if (!IsPlayer[Colour]) return;
    if (I_Start < 0) {
        if (Board[i][j] != Colour) return;
        I_Start = i;
        J_Start = j;
        document.images[ImgNum(i, j)].src = Images[Colour + 3].src;
        GetCBoard();
        return;
    }
    if (I_End < 0) {
        if (Board[i][j] == -1) {
            if ((i == I_Start) && (Math.abs(j - J_Start) == 1) ||
                (j == J_Start) && (Math.abs(i - I_Start) == 1) ||
                (i == I_Start + 1) && (j == J_Start - 1) ||
                (i == I_Start - 1) && (j == J_Start + 1)) {
                MakeMove(i - I_Start, j - J_Start, true);
                OverTest(Colour, true);
                I_Start = -1;
                J_Start = -1;
                Colour = 1 - Colour;
                GetCBoard();
            }
            return;
        }
        if (Board[i][j] === Colour) {
            if ((i === I_Start) && (j === J_Start)) {
                document.images[ImgNum(I_Start, J_Start)].src = Images[Colour + 1].src;
                I_Start = -1;
                J_Start = -1;
                GetCBoard();
                return;
            }
            if ((i === I_Start) && (Math.abs(j - J_Start) <= 2) ||
                (j === J_Start) && (Math.abs(i - I_Start) <= 2) ||
                (i === I_Start + 1) && (j === J_Start - 1) ||
                (i === I_Start - 1) && (j === J_Start + 1) ||
                (i === I_Start + 2) && (j === J_Start - 2) ||
                (i === I_Start - 2) && (j === J_Start + 2)) {
                if ((Math.abs(i - I_Start) === 1) || (Math.abs(j - J_Start) === 1)) {
                    I_End = i;
                    J_End = j;
                    document.images[ImgNum(I_End, J_End)].src = Images[Colour + 3].src;
                    GetCBoard();
                    return;
                }
                if (Board[(i + I_Start) / 2][(j + J_Start) / 2] === Colour) {
                    I_End = i;
                    J_End = j;
                    document.images[ImgNum(I_End, J_End)].src = Images[Colour + 3].src;
                    document.images[ImgNum((I_Start + I_End) / 2, (J_Start + J_End) / 2)].src = Images[Colour + 3].src;
                    GetCBoard();
                    return;
                }
            }
            document.images[ImgNum(I_Start, J_Start)].src = Images[Colour + 1].src;
            I_Start = -1;
            J_Start = -1;
            MouseDown(i, j);
            return;
        }
    }
    if (Board[i][j] == Colour) {
        if ((Math.abs(I_End - I_Start) == 2) || (Math.abs(J_End - J_Start) == 2))
            document.images[ImgNum((I_Start + I_End) / 2, (J_Start + J_End) / 2)].src = Images[Colour + 1].src;
        document.images[ImgNum(I_Start, J_Start)].src = Images[Colour + 1].src;
        document.images[ImgNum(I_End, J_End)].src = Images[Colour + 1].src;
        I_Start = -1;
        J_Start = -1;
        I_End = -1;
        J_End = -1;
        MouseDown(i, j);
        return;
    }
    for (n = 0; n < 6; n++) {
        if ((CBoard[n][0] == i) && (CBoard[n][1] == j)) color = n;
    }
    if (color < 0) return;
    if (Math.abs(2 * (i - I_Start) + (j - J_Start)) + 2 * Math.abs(j - J_Start) < Math.abs(2 * (i - I_End) + (j - J_End)) + 2 * Math.abs(j - J_End))
        MakeMove(i - I_Start, j - J_Start, true);
    else
        MakeMove(i - I_End, j - J_End, true);
    OverTest(Colour, true);
    I_Start = -1;
    J_Start = -1;
    I_End = -1;
    J_End = -1;
    Colour = 1 - Colour;
    GetCBoard();
}

function MouseOut(i, j) {
    var n, color = -1;
    if (IsOver > 0) return;
    if (!IsPlayer[Colour]) return;
    if (I_Start < 0) return;
    for (n = 0; n < 6; n++) {
        if ((CBoard[n][0] == i) && (CBoard[n][1] == j)) color = n;
    }
    if (color < 0) return;
    document.images[ImgNum(I_Start, J_Start)].src = Images[Colour + 3].src;
    if (I_End >= 0) {
        document.images[ImgNum(I_End, J_End)].src = Images[Colour + 3].src;
        if ((Math.abs(I_End - I_Start) == 2) || (Math.abs(J_End - J_Start) == 2))
            document.images[ImgNum((I_Start + I_End) / 2, (J_Start + J_End) / 2)].src = Images[Colour + 3].src;
    }
}

function GetBestMoveMin(color) {
    var ii, jj, nn, tmp, ii0_best, jj0_best, ii1_best, jj1_best, iid_best, jjd_best, eval_best = -10000;
    var dirI = [1, 0, -1, -1, 0, 1];
    var dirJ = [0, 1, 1, 0, -1, -1];

    Colour = color;
    GColour = color;
    var TestBoard = new Array(Size);
    for (k = 0; k < Size; k++) {
        TestBoard[k] = new Array(Size);
    }
    for (ii = 0; ii < Size; ii++) {
        for (jj = 0; jj < Size; jj++)
            TestBoard[ii][jj] = Board[ii][jj];
    }

    for (ii = 0; ii < Size; ii++) {
        for (jj = 0; jj < Size; jj++) {
            if (Board[ii][jj] == color) {
                I_Start = ii;
                J_Start = jj;
                I_End = -1;
                J_End = -1;
                for (nn = 0; nn < 6; nn++) { //перебираются 6 вариантов перемещения
                    tmp = MakeMove(dirI[nn], dirJ[nn], false);


                    if (tmp > 0) {

                        tmp = GetBestEval(1 - color, GlobalDepth, false);

                        if (eval_best < tmp) {
                            ii0_best = I_Start;
                            jj0_best = J_Start;
                            ii1_best = I_End;
                            jj1_best = J_End;
                            iid_best = dirI[nn];
                            jjd_best = dirJ[nn];
                            eval_best = tmp;
                        }
                        for (var h = 0; h < Size; h++) {
                            for (var k = 0; k < Size; k++)
                                Board[h][k] = TestBoard[h][k];
                        }
                    }
                }
            }
        }
    }
    for (ii = 0; ii < Size - 1; ii++) { //анализ ходов 2 шаров
        for (jj = 0; jj < Size; jj++) {
            if ((Board[ii][jj] == color) && (Board[ii + 1][jj] == color)) {
                I_Start = ii;
                J_Start = jj;
                I_End = ii + 1;
                J_End = jj;
                for (nn = 0; nn < 6; nn++) {
                    tmp = MakeMove(dirI[nn], dirJ[nn], false);
                    if (tmp > 0) {

                        tmp = GetBestEval(1 - color, GlobalDepth, false);
                        if (eval_best < tmp) {
                            ii0_best = I_Start;
                            jj0_best = J_Start;
                            ii1_best = I_End;
                            jj1_best = J_End;
                            iid_best = dirI[nn];
                            jjd_best = dirJ[nn];
                            eval_best = tmp;
                        }
                        for (var hh = 0; hh < Size; hh++) {
                            for (var kk = 0; kk < Size; kk++)
                                Board[hh][kk] = TestBoard[hh][kk];
                        }
                    }
                }
            }
        }
    }
    for (ii = 0; ii < Size; ii++) {
        for (jj = 0; jj < Size - 1; jj++) {
            if ((Board[ii][jj] == color) && (Board[ii][jj + 1] == color)) {
                I_Start = ii;
                J_Start = jj;
                I_End = ii;
                J_End = jj + 1;
                for (nn = 0; nn < 6; nn++) {
                    tmp = MakeMove(dirI[nn], dirJ[nn], false);
                    if (tmp > 0) {

                        tmp = GetBestEval(1 - color, GlobalDepth, false);
                        if (eval_best < tmp) {
                            ii0_best = I_Start;
                            jj0_best = J_Start;
                            ii1_best = I_End;
                            jj1_best = J_End;
                            iid_best = dirI[nn];
                            jjd_best = dirJ[nn];
                            eval_best = tmp;
                        }
                        for (var hh = 0; hh < Size; hh++) {
                            for (var kk = 0; kk < Size; kk++)
                                Board[hh][kk] = TestBoard[hh][kk];
                        }
                    }
                }
            }
        }
    }
    for (ii = 1; ii < Size; ii++) {
        for (jj = 0; jj < Size - 1; jj++) {
            if ((Board[ii][jj] == color) && (Board[ii - 1][jj + 1] == color)) {
                I_Start = ii;
                J_Start = jj;
                I_End = ii - 1;
                J_End = jj + 1;
                for (nn = 0; nn < 6; nn++) {
                    tmp = MakeMove(dirI[nn], dirJ[nn], false);
                    if (tmp > 0) {

                        tmp = GetBestEval(1 - color, GlobalDepth, false);

                        if (eval_best < tmp) {
                            ii0_best = I_Start;
                            jj0_best = J_Start;
                            ii1_best = I_End;
                            jj1_best = J_End;
                            iid_best = dirI[nn];
                            jjd_best = dirJ[nn];
                            eval_best = tmp;
                        }
                        for (var hh = 0; hh < Size; hh++) {
                            for (var kk = 0; kk < Size; kk++)
                                Board[hh][kk] = TestBoard[hh][kk];
                        }
                    }
                }
            }
        }
    }
    for (ii = 0; ii < Size - 2; ii++) {  // анализ ходов 3 шариков
        for (jj = 0; jj < Size; jj++) {
            if ((Board[ii][jj] == color) && (Board[ii + 1][jj] == color) && (Board[ii + 2][jj] == color)) {
                I_Start = ii;
                J_Start = jj;
                I_End = ii + 2;
                J_End = jj;
                for (nn = 0; nn < 6; nn++) {
                    tmp = MakeMove(dirI[nn], dirJ[nn], false);
                    if (tmp > 0) {

                        tmp = GetBestEval(1 - color, GlobalDepth, false);
                        if (eval_best < tmp) {
                            ii0_best = I_Start;
                            jj0_best = J_Start;
                            ii1_best = I_End;
                            jj1_best = J_End;
                            iid_best = dirI[nn];
                            jjd_best = dirJ[nn];
                            eval_best = tmp;
                        }
                        for (var h = 0; h < Size; h++) {
                            for (var kk = 0; kk < Size; kk++)
                                Board[h][kk] = TestBoard[h][kk];
                        }
                    }
                }
            }
        }
    }
    for (ii = 0; ii < Size; ii++) {
        for (jj = 0; jj < Size - 2; jj++) {
            if ((Board[ii][jj] == color) && (Board[ii][jj + 1] == color) && (Board[ii][jj + 2] == color)) {
                I_Start = ii;
                J_Start = jj;
                I_End = ii;
                J_End = jj + 2;
                for (nn = 0; nn < 6; nn++) {
                    tmp = MakeMove(dirI[nn], dirJ[nn], false);
                    if (tmp > 0) {

                        tmp = GetBestEval(1 - color, GlobalDepth, false);
                        if (eval_best < tmp) {
                            ii0_best = I_Start;
                            jj0_best = J_Start;
                            ii1_best = I_End;
                            jj1_best = J_End;
                            iid_best = dirI[nn];
                            jjd_best = dirJ[nn];
                            eval_best = tmp;
                        }
                        for (var h = 0; h < Size; h++) {
                            for (var kk = 0; kk < Size; kk++)
                                Board[h][kk] = TestBoard[h][kk];
                        }
                    }
                }
            }
        }
    }
    for (ii = 2; ii < Size; ii++) {
        for (jj = 0; jj < Size - 2; jj++) {
            if ((Board[ii][jj] == color) && (Board[ii - 1][jj + 1] == color) && (Board[ii - 2][jj + 2] == color)) {
                I_Start = ii;
                J_Start = jj;
                I_End = ii - 2;
                J_End = jj + 2;
                for (nn = 0; nn < 6; nn++) {
                    tmp = MakeMove(dirI[nn], dirJ[nn], false);
                    if (tmp > 0) {

                        tmp = GetBestEval(1 - color, GlobalDepth, false);

                        if (eval_best < tmp) {
                            ii0_best = I_Start;
                            jj0_best = J_Start;
                            ii1_best = I_End;
                            jj1_best = J_End;
                            iid_best = dirI[nn];
                            jjd_best = dirJ[nn];
                            eval_best = tmp;
                        }
                        for (var h = 0; h < Size; h++) {
                            for (var kk = 0; kk < Size; kk++)
                                Board[h][kk] = TestBoard[h][kk];
                        }
                    }
                }
            }
        }
    }
    I_Start = ii0_best;
    J_Start = jj0_best;
    I_End = ii1_best;
    J_End = jj1_best;
    I_Dir = iid_best;
    J_Dir = jjd_best;
}

function GetBestEval(color, depth, maxPlayer) {
    var ii, jj, nn, vv, vv_best, I_S, J_S, I_E, J_E;
    var dirI = [1, 0, -1, -1, 0, 1];
    var dirJ = [0, 1, 1, 0, -1, -1];

    Colour = color;

    var TestBoard = new Array(Size);
    for (k = 0; k < Size; k++) {
        TestBoard[k] = new Array(Size);
    }
    for (ii = 0; ii < Size; ii++) {
        for (jj = 0; jj < Size; jj++)
            TestBoard[ii][jj] = Board[ii][jj];
    }

    if (depth == 0) {
        Colour = 1 - color;

            return EvalBoard(Colour)+ Math.random()*5;

    }
    vv_best = -10000;
    for (ii = 0; ii < Size; ii++) {  //анализ хода 1 шарика
        for (jj = 0; jj < Size; jj++) {
            if (Board[ii][jj] === color) { //если в этой клетке шарик нужного нам игрока
                I_S = I_Start;
                J_S = J_Start;
                I_E = I_End;
                J_E = J_End;

                I_Start = ii;
                J_Start = jj;
                I_End = -1;
                J_End = -1;
                for (nn = 0; nn < 6; nn++) { //перебираются 6 вариантов перемещения
                    vv = MakeMove(dirI[nn], dirJ[nn], false);

                    if (vv > 0) {

                        vv = GetBestEval(1 - color, depth - 1, maxPlayer ^ true);

                        if (vv_best < vv) {

                            vv_best = vv;
                        }
                        for (var hh = 0; hh < Size; hh++) {
                            for (var kk = 0; kk < Size; kk++)
                                Board[hh][kk] = TestBoard[hh][kk];
                        }
                    }
                }
                I_Start = I_S;
                J_Start = J_S;
                I_End = I_E;
                J_End = J_E;
            }
        }
    }
    for (ii = 0; ii < Size - 1; ii++) { //анализ ходов 2 шаров
        for (jj = 0; jj < Size; jj++) {
            if ((Board[ii][jj] == color) && (Board[ii + 1][jj] == color)) {

                I_S = I_Start;
                J_S = J_Start;
                I_E = I_End;
                J_E = J_End;

                I_Start = ii;
                J_Start = jj;
                I_End = ii + 1;
                J_End = jj;
                for (nn = 0; nn < 6; nn++) { //перебираются 6 вариантов перемещения
                    vv = MakeMove(dirI[nn], dirJ[nn], false);

                    if (vv > 0) {

                        vv = GetBestEval(1 - color, depth - 1, maxPlayer ^ true);

                        if (vv_best < vv) {

                            vv_best = vv;
                        }
                        for (var hh = 0; hh < Size; hh++) {
                            for (var kk = 0; kk < Size; kk++)
                                Board[hh][kk] = TestBoard[hh][kk];
                        }
                    }
                }
                I_Start = I_S;
                J_Start = J_S;
                I_End = I_E;
                J_End = J_E;
            }
        }
    }
    for (ii = 0; ii < Size; ii++) {
        for (jj = 0; jj < Size - 1; jj++) {
            if ((Board[ii][jj] == color) && (Board[ii][jj + 1] == color)) {

                I_S = I_Start;
                J_S = J_Start;
                I_E = I_End;
                J_E = J_End;

                I_Start = ii;
                J_Start = jj;
                I_End = ii;
                J_End = jj + 1;
                for (nn = 0; nn < 6; nn++) { //перебираются 6 вариантов перемещения
                    vv = MakeMove(dirI[nn], dirJ[nn], false);

                    if (vv > 0) {

                        vv = GetBestEval(1 - color, depth - 1, maxPlayer ^ true);


                        if (vv_best < vv) {

                            vv_best = vv;
                        }
                        for (var hh = 0; hh < Size; hh++) {
                            for (var kk = 0; kk < Size; kk++)
                                Board[hh][kk] = TestBoard[hh][kk];
                        }
                    }
                }
                I_Start = I_S;
                J_Start = J_S;
                I_End = I_E;
                J_End = J_E;
            }
        }
    }
    for (ii = 1; ii < Size; ii++) {
        for (jj = 0; jj < Size - 1; jj++) {
            if ((Board[ii][jj] == color) && (Board[ii - 1][jj + 1] == color)) {
                I_S = I_Start;
                J_S = J_Start;
                I_E = I_End;
                J_E = J_End;

                I_Start = ii;
                J_Start = jj;
                I_End = ii - 1;
                J_End = jj + 1;
                for (nn = 0; nn < 6; nn++) { //перебираются 6 вариантов перемещения
                    vv = MakeMove(dirI[nn], dirJ[nn], false);

                    if (vv > 0) {

                        vv = GetBestEval(1 - color, depth - 1, maxPlayer ^ true);


                        if (vv_best < vv) {

                            vv_best = vv;
                        }
                        for (var hh = 0; hh < Size; hh++) {
                            for (var kk = 0; kk < Size; kk++)
                                Board[hh][kk] = TestBoard[hh][kk];
                        }
                    }
                }
                I_Start = I_S;
                J_Start = J_S;
                I_End = I_E;
                J_End = J_E;
            }
        }
    }
    for (ii = 0; ii < Size - 2; ii++) {  // анализ ходов 3 шариков
        for (jj = 0; jj < Size; jj++) {
            if ((Board[ii][jj] == color) && (Board[ii + 1][jj] == color) && (Board[ii + 2][jj] == color)) {
                I_S = I_Start;
                J_S = J_Start;
                I_E = I_End;
                J_E = J_End;

                I_Start = ii;
                J_Start = jj;
                I_End = ii + 2;
                J_End = jj;
                for (nn = 0; nn < 6; nn++) { //перебираются 6 вариантов перемещения
                    vv = MakeMove(dirI[nn], dirJ[nn], false);

                    if (vv > 0) {

                        vv = GetBestEval(1 - color, depth - 1, maxPlayer ^ true);

                        if (vv_best < vv) {

                            vv_best = vv;
                        }
                        for (var hh = 0; hh < Size; hh++) {
                            for (var kk = 0; kk < Size; kk++)
                                Board[hh][kk] = TestBoard[hh][kk];
                        }
                    }
                }
                I_Start = I_S;
                J_Start = J_S;
                I_End = I_E;
                J_End = J_E;
            }
        }
    }
    for (ii = 0; ii < Size; ii++) {
        for (jj = 0; jj < Size - 2; jj++) {
            if ((Board[ii][jj] == color) && (Board[ii][jj + 1] == color) && (Board[ii][jj + 2] == color)) {
                I_S = I_Start;
                J_S = J_Start;
                I_E = I_End;
                J_E = J_End;

                I_Start = ii;
                J_Start = jj;
                I_End = ii;
                J_End = jj + 2;
                for (nn = 0; nn < 6; nn++) { //перебираются 6 вариантов перемещения
                    vv = MakeMove(dirI[nn], dirJ[nn], false);

                    if (vv > 0) {

                        vv = GetBestEval(1 - color, depth - 1, maxPlayer ^ true);


                        if (vv_best < vv) {

                            vv_best = vv;
                        }
                        for (var hh = 0; hh < Size; hh++) {
                            for (var kk = 0; kk < Size; kk++)
                                Board[hh][kk] = TestBoard[hh][kk];
                        }
                    }
                }
                I_Start = I_S;
                J_Start = J_S;
                I_End = I_E;
                J_End = J_E;
            }
        }
    }
    for (ii = 2; ii < Size; ii++) {
        for (jj = 0; jj < Size - 2; jj++) {
            if ((Board[ii][jj] == color) && (Board[ii - 1][jj + 1] == color) && (Board[ii - 2][jj + 2] == color)) {
                I_S = I_Start;
                J_S = J_Start;
                I_E = I_End;
                J_E = J_End;

                I_Start = ii;
                J_Start = jj;
                I_End = ii - 2;
                J_End = jj + 2;
                for (nn = 0; nn < 6; nn++) { //перебираются 6 вариантов перемещения
                    vv = MakeMove(dirI[nn], dirJ[nn], false);

                    if (vv > 0) {

                        vv = GetBestEval(1 - color, depth - 1, maxPlayer ^ true);


                        if (vv_best < vv) {

                            vv_best = vv;
                        }
                        for (var hh = 0; hh < Size; hh++) {
                            for (var kk = 0; kk < Size; kk++)
                                Board[hh][kk] = TestBoard[hh][kk];
                        }
                    }
                }
                I_Start = I_S;
                J_Start = J_S;
                I_End = I_E;
                J_End = J_E;
            }
        }
    }

    Colour = 1 - color;
    return -vv_best;
}

var r1 = 10, r2 = 9, r3 = 5, r4 = 4, r5 = 2, r6 = 0;

Center = new Array(Size);
Center[0] = [r6, r6, r6, r6, r5, r5, r5, r5, r5];
Center[1] = [r6, r6, r6, r5, r4, r4, r4, r4, r5];
Center[2] = [r6, r6, r5, r4, r3, r3, r3, r4, r5];
Center[3] = [r6, r5, r4, r3, r2, r2, r3, r4, r5];
Center[4] = [r5, r4, r3, r2, r1, r2, r3, r4, r5];
Center[5] = [r5, r4, r3, r2, r2, r3, r4, r5, r6];
Center[6] = [r5, r4, r3, r3, r3, r4, r5, r6, r6];
Center[7] = [r5, r4, r4, r4, r4, r5, r6, r6, r6];
Center[8] = [r5, r5, r5, r5, r5, r6, r6, r6, r6];

function OverTest(nn, needMessage) {  // кто-то выиграл?
    var ii, jj, color = 1 - nn, vv = 0;
    IsOver = false;
    for (jj = 0; jj < Size; jj++) {  //  сколько на поле шаров противника?
        for (ii = 0; ii < Size; ii++) {
            if (Board[ii][jj] == color) vv++;
        }
    }
    if ((needMessage) && (vv < 14))
        document.images[13 - vv + nn * 67].src = Images[color + 1].src;
    if (vv < 9) {

        IsOver = true;
        if (needMessage) {
            if (nn == 0)
            {alert("white has won!");
                console.log("white");}
            else {alert("black has won!");
                console.log("black");
            }
        }
        StepStat = StepTime / StepCounter;
    }
    return (vv);
}


function RefreshScreen() {
    var ii, jj, nn = 6;
    for (jj = 0; jj < Size; jj++) {
        for (ii = 0; ii < Size; ii++) {
            if (Board[ii][jj] > -2)
                document.images[nn++].src = Images[Board[ii][jj] + 1].src;
        }
    }
}

function EvalCenter(color) {
    var i, j, eval = 0;
    for (j = 0; j < Size; j++) {
        for (i = 0; i < Size; i++) {
            if (Board[i][j] >= 0)
                eval += Center[i][j] * (2 * Board[i][j] - 1);
        }
    }
    if (color === 0) eval *= -1;
    return eval;
}

function EvalEdge(color) {
    var i, j, eval = 0;
    for (i = 0; i < 24; i++) {
        if (Board[CI[i][0]][CJ[i][0]] == color) {
            for (j = 1; j < CI[i].length; j++)
                if ((Board[CI[i][0] + CI[i][j]][CJ[i][0] + CJ[i][j]] === 1 - color) &&
                    (Board[CI[i][0] + 2 * CI[i][j]][CJ[i][0] + 2 * CJ[i][j]] === 1 - color))
                    eval -= 8;
                else {
                    if ((Board[CI[i][0] + CI[i][j]][CJ[i][0] + CJ[i][j]] === color) &&
                        (Board[CI[i][0] + 2 * CI[i][j]][CJ[i][0] + 2 * CJ[i][j]] === 1 - color) &&
                        (Board[CI[i][0] + 3 * CI[i][j]][CJ[i][0] + 3 * CJ[i][j]] === 1 - color) &&
                        (Board[CI[i][0] + 4 * CI[i][j]][CJ[i][0] + 4 * CJ[i][j]] === 1 - color))
                        eval -= 8;
                }
        }
        if (Board[CI[i][0]][CJ[i][0]] === 1 - color) {
            for (j = 1; j < CI[i].length; j++)
                if ((Board[CI[i][0] + CI[i][j]][CJ[i][0] + CJ[i][j]] === color) &&
                    (Board[CI[i][0] + 2 * CI[i][j]][CJ[i][0] + 2 * CJ[i][j]] === color))
                    eval += 5;
                else {
                    if ((Board[CI[i][0] + CI[i][j]][CJ[i][0] + CJ[i][j]] === 1 - color) &&
                        (Board[CI[i][0] + 2 * CI[i][j]][CJ[i][0] + 2 * CJ[i][j]] === color) &&
                        (Board[CI[i][0] + 3 * CI[i][j]][CJ[i][0] + 3 * CJ[i][j]] === color) &&
                        (Board[CI[i][0] + 4 * CI[i][j]][CJ[i][0] + 4 * CJ[i][j]] === color))
                        eval += 5;
                }
        }
    }
    return eval;
}


function EvalBoard(color) {
    var i, j, eval = 0;
    eval = EvalCenter(color)*5 + EvalCount(color)*10 + EvalNeighbour(color)*3 + EvalEdge(color);

    return eval;
}

function EvalCount(color) {
    var i, j, eval = 0;
    for (j = 0; j < Size; j++) {
        for (i = 0; i < Size; i++) {
            if (Board[i][j] === 1)
                eval++;
            if (Board[i][j] === 0)
                eval--;
        }
    }
    return color === 1 ? eval : -eval;
}

function EvalNeighbour(color) { //  в разработке, баги
    var i, j, n, ally = 0, tmp = 0;
    var dirI = [1, 0, -1, -1, 0, 1];
    var dirJ = [0, 1, 1, 0, -1, -1];

    for (i = 0; i < Size; i++) {
        for (j = 0; j < Size; j++) {
            if (Board[i][j] === color) {
                for (n = 0; n < 6; n++) {
                    if ((i + dirI[n]) < 9 && (i + dirI[n]) >= 0 && (j + dirJ[n]) < 9 && (j + dirJ[n]) <= 9)
                        if (Board[i + dirI[n]][j + dirJ[n]] === color)
                            ally++;
                        else if (Board[i + dirI[n]][j + dirJ[n]] === color) {
                            ally--;
                        }
                }
            }
        }
    }
    return ally;
}


Init();
Init();
setInterval("Timer()", 100);