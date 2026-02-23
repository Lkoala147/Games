#!/usr/bin/env python3
"""
Juego de Ajedrez Profesional - Estilo Chess.com
Características: JcJ (Jugador vs Jugador) y JcIA (Jugador vs IA)
Interfaz oscura profesional
"""

import tkinter as tk
from tkinter import messagebox
import copy
import random

# Colores tema oscuro profesional (estilo Chess.com)
COLORS = {
    'bg': '#312E2B',
    'board_light': '#EBECD0',
    'board_dark': '#739552',
    'board_light_highlight': '#F6F669',
    'board_dark_highlight': '#BACA44',
    'menu_bg': '#262421',
    'menu_hover': '#3C3935',
    'text': '#FFFFFF',
    'text_secondary': '#A0A0A0',
    'button': '#81B64C',
    'button_hover': '#96C95D',
    'selected': '#F6F669',
    'valid_move': '#BACA44',
    'check': '#FF6B6B',
}

# Piezas Unicode
PIECES_UNICODE = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
}


class ChessBoard:
    """Clase que maneja la lógica del tablero de ajedrez"""
    
    def __init__(self):
        self.reset_board()
        
    def reset_board(self):
        """Inicializa el tablero en la posición inicial"""
        self.board = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [None, None, None, None, None, None, None, None],
            [None, None, None, None, None, None, None, None],
            [None, None, None, None, None, None, None, None],
            [None, None, None, None, None, None, None, None],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ]
        self.white_turn = True
        self.selected_piece = None
        self.valid_moves = []
        self.move_history = []
        self.white_king_moved = False
        self.black_king_moved = False
        self.white_rook_a_moved = False
        self.white_rook_h_moved = False
        self.black_rook_a_moved = False
        self.black_rook_h_moved = False
        self.en_passant_target = None
        self.halfmove_clock = 0
        self.fullmove_number = 1
        
    def get_piece(self, row, col):
        """Obtiene la pieza en una posición"""
        if 0 <= row < 8 and 0 <= col < 8:
            return self.board[row][col]
        return None
    
    def is_white(self, piece):
        """Verifica si una pieza es blanca"""
        return piece is not None and piece.isupper()
    
    def is_black(self, piece):
        """Verifica si una pieza es negra"""
        return piece is not None and piece.islower()
    
    def is_enemy(self, piece1, piece2):
        """Verifica si dos piezas son enemigas"""
        if piece1 is None or piece2 is None:
            return False
        return (self.is_white(piece1) and self.is_black(piece2)) or \
               (self.is_black(piece1) and self.is_white(piece2))
    
    def get_valid_moves(self, row, col):
        """Obtiene todos los movimientos válidos para una pieza"""
        piece = self.get_piece(row, col)
        if piece is None:
            return []
        
        # Verificar si es el turno correcto
        if (self.white_turn and self.is_black(piece)) or \
           (not self.white_turn and self.is_white(piece)):
            return []
        
        moves = []
        piece_type = piece.upper()
        
        if piece_type == 'P':
            moves = self._get_pawn_moves(row, col)
        elif piece_type == 'N':
            moves = self._get_knight_moves(row, col)
        elif piece_type == 'B':
            moves = self._get_bishop_moves(row, col)
        elif piece_type == 'R':
            moves = self._get_rook_moves(row, col)
        elif piece_type == 'Q':
            moves = self._get_queen_moves(row, col)
        elif piece_type == 'K':
            moves = self._get_king_moves(row, col)
        
        # Filtrar movimientos que dejen al rey en jaque
        valid_moves = []
        for move_row, move_col in moves:
            if self._is_legal_move(row, col, move_row, move_col):
                valid_moves.append((move_row, move_col))
        
        return valid_moves
    
    def _get_pawn_moves(self, row, col):
        """Obtiene movimientos válidos para un peón"""
        moves = []
        piece = self.get_piece(row, col)
        direction = -1 if self.is_white(piece) else 1
        start_row = 6 if self.is_white(piece) else 1
        
        # Movimiento hacia adelante
        if self.get_piece(row + direction, col) is None:
            moves.append((row + direction, col))
            # Doble movimiento inicial
            if row == start_row and self.get_piece(row + 2*direction, col) is None:
                moves.append((row + 2*direction, col))
        
        # Capturas diagonales
        for dc in [-1, 1]:
            new_col = col + dc
            new_row = row + direction
            target = self.get_piece(new_row, new_col)
            if target and self.is_enemy(piece, target):
                moves.append((new_row, new_col))
            # En passant
            if self.en_passant_target == (new_row, new_col):
                moves.append((new_row, new_col))
        
        return moves
    
    def _get_knight_moves(self, row, col):
        """Obtiene movimientos válidos para un caballo"""
        moves = []
        piece = self.get_piece(row, col)
        knight_moves = [
            (-2, -1), (-2, 1), (-1, -2), (-1, 2),
            (1, -2), (1, 2), (2, -1), (2, 1)
        ]
        
        for dr, dc in knight_moves:
            new_row, new_col = row + dr, col + dc
            target = self.get_piece(new_row, new_col)
            if 0 <= new_row < 8 and 0 <= new_col < 8:
                if target is None or self.is_enemy(piece, target):
                    moves.append((new_row, new_col))
        
        return moves
    
    def _get_bishop_moves(self, row, col):
        """Obtiene movimientos válidos para un alfil"""
        return self._get_diagonal_moves(row, col)
    
    def _get_rook_moves(self, row, col):
        """Obtiene movimientos válidos para una torre"""
        return self._get_straight_moves(row, col)
    
    def _get_queen_moves(self, row, col):
        """Obtiene movimientos válidos para una reina"""
        return self._get_diagonal_moves(row, col) + self._get_straight_moves(row, col)
    
    def _get_king_moves(self, row, col):
        """Obtiene movimientos válidos para un rey"""
        moves = []
        piece = self.get_piece(row, col)
        
        # Movimientos normales
        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:
                if dr == 0 and dc == 0:
                    continue
                new_row, new_col = row + dr, col + dc
                target = self.get_piece(new_row, new_col)
                if 0 <= new_row < 8 and 0 <= new_col < 8:
                    if target is None or self.is_enemy(piece, target):
                        moves.append((new_row, new_col))
        
        # Enroque
        moves.extend(self._get_castling_moves(row, col))
        
        return moves
    
    def _get_castling_moves(self, row, col):
        """Obtiene movimientos de enroque disponibles"""
        moves = []
        piece = self.get_piece(row, col)
        
        if self.is_in_check(self.is_white(piece)):
            return moves
        
        # Enroque corto
        if self.is_white(piece) and not self.white_king_moved and not self.white_rook_h_moved:
            if self.board[7][5] is None and self.board[7][6] is None:
                if not self._is_square_attacked(7, 5, False) and not self._is_square_attacked(7, 6, False):
                    moves.append((7, 6))
        elif self.is_black(piece) and not self.black_king_moved and not self.black_rook_h_moved:
            if self.board[0][5] is None and self.board[0][6] is None:
                if not self._is_square_attacked(0, 5, True) and not self._is_square_attacked(0, 6, True):
                    moves.append((0, 6))
        
        # Enroque largo
        if self.is_white(piece) and not self.white_king_moved and not self.white_rook_a_moved:
            if self.board[7][1] is None and self.board[7][2] is None and self.board[7][3] is None:
                if not self._is_square_attacked(7, 2, False) and not self._is_square_attacked(7, 3, False):
                    moves.append((7, 2))
        elif self.is_black(piece) and not self.black_king_moved and not self.black_rook_a_moved:
            if self.board[0][1] is None and self.board[0][2] is None and self.board[0][3] is None:
                if not self._is_square_attacked(0, 2, True) and not self._is_square_attacked(0, 3, True):
                    moves.append((0, 2))
        
        return moves
    
    def _get_diagonal_moves(self, row, col):
        """Obtiene movimientos en diagonal"""
        moves = []
        piece = self.get_piece(row, col)
        directions = [(-1, -1), (-1, 1), (1, -1), (1, 1)]
        
        for dr, dc in directions:
            for i in range(1, 8):
                new_row, new_col = row + dr*i, col + dc*i
                if not (0 <= new_row < 8 and 0 <= new_col < 8):
                    break
                target = self.get_piece(new_row, new_col)
                if target is None:
                    moves.append((new_row, new_col))
                elif self.is_enemy(piece, target):
                    moves.append((new_row, new_col))
                    break
                else:
                    break
        
        return moves
    
    def _get_straight_moves(self, row, col):
        """Obtiene movimientos en línea recta"""
        moves = []
        piece = self.get_piece(row, col)
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        
        for dr, dc in directions:
            for i in range(1, 8):
                new_row, new_col = row + dr*i, col + dc*i
                if not (0 <= new_row < 8 and 0 <= new_col < 8):
                    break
                target = self.get_piece(new_row, new_col)
                if target is None:
                    moves.append((new_row, new_col))
                elif self.is_enemy(piece, target):
                    moves.append((new_row, new_col))
                    break
                else:
                    break
        
        return moves
    
    def _is_legal_move(self, from_row, from_col, to_row, to_col):
        """Verifica si un movimiento es legal (no deja al rey en jaque)"""
        # Simular movimiento
        board_copy = copy.deepcopy(self.board)
        piece = self.board[from_row][from_col]
        
        self.board[to_row][to_col] = piece
        self.board[from_row][from_col] = None
        
        # Verificar si el rey queda en jaque
        is_legal = not self.is_in_check(self.is_white(piece))
        
        # Restaurar tablero
        self.board = board_copy
        
        return is_legal
    
    def is_in_check(self, white_king):
        """Verifica si un rey está en jaque"""
        # Encontrar el rey
        king = 'K' if white_king else 'k'
        king_pos = None
        for r in range(8):
            for c in range(8):
                if self.board[r][c] == king:
                    king_pos = (r, c)
                    break
            if king_pos:
                break
        
        if not king_pos:
            return False
        
        return self._is_square_attacked(king_pos[0], king_pos[1], white_king)
    
    def _is_square_attacked(self, row, col, by_white):
        """Verifica si una casilla está siendo atacada"""
        for r in range(8):
            for c in range(8):
                piece = self.board[r][c]
                if piece is None:
                    continue
                if (by_white and self.is_black(piece)) or (not by_white and self.is_white(piece)):
                    # Obtener movimientos sin filtrar por jaque
                    moves = self._get_raw_moves(r, c)
                    if (row, col) in moves:
                        return True
        return False
    
    def _get_raw_moves(self, row, col):
        """Obtiene movimientos sin verificar jaque"""
        piece = self.board[row][col]
        if piece is None:
            return []
        
        piece_type = piece.upper()
        
        if piece_type == 'P':
            return self._get_pawn_attacks(row, col)
        elif piece_type == 'N':
            return self._get_knight_moves(row, col)
        elif piece_type == 'B':
            return self._get_diagonal_moves(row, col)
        elif piece_type == 'R':
            return self._get_straight_moves(row, col)
        elif piece_type == 'Q':
            return self._get_diagonal_moves(row, col) + self._get_straight_moves(row, col)
        elif piece_type == 'K':
            moves = []
            for dr in [-1, 0, 1]:
                for dc in [-1, 0, 1]:
                    if dr == 0 and dc == 0:
                        continue
                    new_row, new_col = row + dr, col + dc
                    if 0 <= new_row < 8 and 0 <= new_col < 8:
                        target = self.board[new_row][new_col]
                        if target is None or self.is_enemy(piece, target):
                            moves.append((new_row, new_col))
            return moves
        
        return []
    
    def _get_pawn_attacks(self, row, col):
        """Obtiene solo los ataques del peón (para verificar jaque)"""
        moves = []
        piece = self.board[row][col]
        direction = -1 if self.is_white(piece) else 1
        
        for dc in [-1, 1]:
            new_col = col + dc
            new_row = row + direction
            if 0 <= new_row < 8 and 0 <= new_col < 8:
                moves.append((new_row, new_col))
        
        return moves
    
    def make_move(self, from_row, from_col, to_row, to_col):
        """Realiza un movimiento en el tablero"""
        piece = self.board[from_row][from_col]
        captured = self.board[to_row][to_col]
        
        # Guardar en historial
        self.move_history.append({
            'from': (from_row, from_col),
            'to': (to_row, to_col),
            'piece': piece,
            'captured': captured,
            'en_passant': self.en_passant_target
        })
        
        # Detectar enroque
        if piece.upper() == 'K' and abs(to_col - from_col) == 2:
            # Mover la torre
            if to_col > from_col:  # Enroque corto
                rook = self.board[from_row][7]
                self.board[from_row][7] = None
                self.board[from_row][5] = rook
            else:  # Enroque largo
                rook = self.board[from_row][0]
                self.board[from_row][0] = None
                self.board[from_row][3] = rook
        
        # Detectar en passant
        if piece.upper() == 'P' and self.en_passant_target == (to_row, to_col):
            # Capturar el peón en passant
            captured_row = from_row
            self.board[captured_row][to_col] = None
        
        # Mover la pieza
        self.board[to_row][to_col] = piece
        self.board[from_row][from_col] = None
        
        # Actualizar en passant
        self.en_passant_target = None
        if piece.upper() == 'P' and abs(to_row - from_row) == 2:
            self.en_passant_target = ((from_row + to_row) // 2, to_col)
        
        # Promoción de peón
        if piece.upper() == 'P' and (to_row == 0 or to_row == 7):
            self.board[to_row][to_col] = 'Q' if self.is_white(piece) else 'q'
        
        # Actualizar flags de enroque
        if piece == 'K':
            self.white_king_moved = True
        elif piece == 'k':
            self.black_king_moved = True
        elif piece == 'R':
            if from_row == 7 and from_col == 0:
                self.white_rook_a_moved = True
            elif from_row == 7 and from_col == 7:
                self.white_rook_h_moved = True
        elif piece == 'r':
            if from_row == 0 and from_col == 0:
                self.black_rook_a_moved = True
            elif from_row == 0 and from_col == 7:
                self.black_rook_h_moved = True
        
        # Cambiar turno
        self.white_turn = not self.white_turn
        
        return True
    
    def is_checkmate(self):
        """Verifica si hay jaque mate"""
        if not self.is_in_check(self.white_turn):
            return False
        
        # Verificar si hay algún movimiento legal
        for row in range(8):
            for col in range(8):
                piece = self.board[row][col]
                if piece and ((self.white_turn and self.is_white(piece)) or 
                             (not self.white_turn and self.is_black(piece))):
                    if len(self.get_valid_moves(row, col)) > 0:
                        return False
        
        return True
    
    def is_stalemate(self):
        """Verifica si hay tablas por ahogado"""
        if self.is_in_check(self.white_turn):
            return False
        
        # Verificar si hay algún movimiento legal
        for row in range(8):
            for col in range(8):
                piece = self.board[row][col]
                if piece and ((self.white_turn and self.is_white(piece)) or 
                             (not self.white_turn and self.is_black(piece))):
                    if len(self.get_valid_moves(row, col)) > 0:
                        return False
        
        return True


class ChessAI:
    """IA simple para jugar contra el jugador"""
    
    def __init__(self, difficulty='medium'):
        self.difficulty = difficulty
        
        # Valores de las piezas
        self.piece_values = {
            'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000,
            'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000
        }
    
    def get_best_move(self, chess_board):
        """Obtiene el mejor movimiento para la IA"""
        all_moves = []
        
        # Obtener todos los movimientos posibles
        for row in range(8):
            for col in range(8):
                piece = chess_board.board[row][col]
                if piece and chess_board.is_black(piece):
                    valid_moves = chess_board.get_valid_moves(row, col)
                    for to_row, to_col in valid_moves:
                        all_moves.append((row, col, to_row, to_col))
        
        if not all_moves:
            return None
        
        if self.difficulty == 'easy':
            return random.choice(all_moves)
        
        # Evaluar movimientos
        best_move = None
        best_score = float('-inf')
        
        for from_row, from_col, to_row, to_col in all_moves:
            score = self._evaluate_move(chess_board, from_row, from_col, to_row, to_col)
            if score > best_score:
                best_score = score
                best_move = (from_row, from_col, to_row, to_col)
        
        return best_move
    
    def _evaluate_move(self, chess_board, from_row, from_col, to_row, to_col):
        """Evalúa un movimiento"""
        score = 0
        
        # Simular movimiento
        board_copy = copy.deepcopy(chess_board.board)
        piece = chess_board.board[from_row][from_col]
        captured = chess_board.board[to_row][to_col]
        
        chess_board.board[to_row][to_col] = piece
        chess_board.board[from_row][from_col] = None
        
        # Valor de captura
        if captured:
            score += self.piece_values.get(captured, 0)
        
        # Penalizar si deja al rey en jaque
        if chess_board.is_in_check(False):
            score -= 500
        
        # Bonificar si pone al enemigo en jaque
        chess_board.white_turn = True
        if chess_board.is_in_check(True):
            score += 50
        chess_board.white_turn = False
        
        # Control del centro
        if 2 <= to_row <= 5 and 2 <= to_col <= 5:
            score += 10
        
        # Restaurar tablero
        chess_board.board = board_copy
        
        return score


class ChessGame:
    """Clase principal del juego de ajedrez"""
    
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Chess Pro - Estilo Chess.com")
        self.root.configure(bg=COLORS['bg'])
        
        # Configurar tamaño de ventana
        window_width = 1200
        window_height = 800
        screen_width = self.root.winfo_screenwidth()
        screen_height = self.root.winfo_screenheight()
        x = (screen_width - window_width) // 2
        y = (screen_height - window_height) // 2
        self.root.geometry(f'{window_width}x{window_height}+{x}+{y}')
        
        self.chess_board = ChessBoard()
        self.ai = ChessAI()
        self.game_mode = None  # 'pvp' o 'pvc'
        self.selected_square = None
        self.highlighted_moves = []
        
        self.show_main_menu()
    
    def show_main_menu(self):
        """Muestra el menú principal"""
        # Limpiar ventana
        for widget in self.root.winfo_children():
            widget.destroy()
        
        # Frame principal
        main_frame = tk.Frame(self.root, bg=COLORS['menu_bg'])
        main_frame.pack(expand=True, fill='both')
        
        # Título
        title_label = tk.Label(
            main_frame,
            text="♔ CHESS PRO ♔",
            font=('Arial', 48, 'bold'),
            fg=COLORS['text'],
            bg=COLORS['menu_bg']
        )
        title_label.pack(pady=50)
        
        subtitle_label = tk.Label(
            main_frame,
            text="Juego de Ajedrez Profesional",
            font=('Arial', 16),
            fg=COLORS['text_secondary'],
            bg=COLORS['menu_bg']
        )
        subtitle_label.pack(pady=10)
        
        # Botones del menú
        button_frame = tk.Frame(main_frame, bg=COLORS['menu_bg'])
        button_frame.pack(pady=50)
        
        pvp_btn = tk.Button(
            button_frame,
            text="Jugador vs Jugador",
            font=('Arial', 18, 'bold'),
            bg=COLORS['button'],
            fg='white',
            activebackground=COLORS['button_hover'],
            width=20,
            height=2,
            bd=0,
            cursor='hand2',
            command=lambda: self.start_game('pvp')
        )
        pvp_btn.pack(pady=15)
        
        pvc_btn = tk.Button(
            button_frame,
            text="Jugador vs IA",
            font=('Arial', 18, 'bold'),
            bg=COLORS['button'],
            fg='white',
            activebackground=COLORS['button_hover'],
            width=20,
            height=2,
            bd=0,
            cursor='hand2',
            command=lambda: self.start_game('pvc')
        )
        pvc_btn.pack(pady=15)
        
        # Efectos hover
        def on_enter(e, btn):
            btn.config(bg=COLORS['button_hover'])
        
        def on_leave(e, btn):
            btn.config(bg=COLORS['button'])
        
        pvp_btn.bind('<Enter>', lambda e: on_enter(e, pvp_btn))
        pvp_btn.bind('<Leave>', lambda e: on_leave(e, pvp_btn))
        pvc_btn.bind('<Enter>', lambda e: on_enter(e, pvc_btn))
        pvc_btn.bind('<Leave>', lambda e: on_leave(e, pvc_btn))
        
        # Footer
        footer_label = tk.Label(
            main_frame,
            text="Desarrollado con Python • Tkinter",
            font=('Arial', 10),
            fg=COLORS['text_secondary'],
            bg=COLORS['menu_bg']
        )
        footer_label.pack(side='bottom', pady=20)
    
    def start_game(self, mode):
        """Inicia una nueva partida"""
        self.game_mode = mode
        self.chess_board.reset_board()
        self.selected_square = None
        self.highlighted_moves = []
        self.show_game_board()
    
    def show_game_board(self):
        """Muestra el tablero de juego"""
        # Limpiar ventana
        for widget in self.root.winfo_children():
            widget.destroy()
        
        # Frame principal
        main_frame = tk.Frame(self.root, bg=COLORS['bg'])
        main_frame.pack(expand=True, fill='both')
        
        # Panel superior
        top_panel = tk.Frame(main_frame, bg=COLORS['menu_bg'], height=60)
        top_panel.pack(fill='x', side='top')
        top_panel.pack_propagate(False)
        
        # Botón de menú
        menu_btn = tk.Button(
            top_panel,
            text="← Menú Principal",
            font=('Arial', 12),
            bg=COLORS['menu_hover'],
            fg=COLORS['text'],
            bd=0,
            cursor='hand2',
            command=self.show_main_menu
        )
        menu_btn.pack(side='left', padx=20, pady=15)
        
        # Título del modo de juego
        mode_text = "Jugador vs Jugador" if self.game_mode == 'pvp' else "Jugador vs IA"
        mode_label = tk.Label(
            top_panel,
            text=mode_text,
            font=('Arial', 16, 'bold'),
            fg=COLORS['text'],
            bg=COLORS['menu_bg']
        )
        mode_label.pack(pady=15)
        
        # Frame del tablero
        board_container = tk.Frame(main_frame, bg=COLORS['bg'])
        board_container.pack(expand=True)
        
        # Panel lateral
        side_panel = tk.Frame(board_container, bg=COLORS['menu_bg'], width=300)
        side_panel.pack(side='right', fill='y', padx=20, pady=20)
        side_panel.pack_propagate(False)
        
        # Info del turno
        self.turn_label = tk.Label(
            side_panel,
            text="Turno: Blancas",
            font=('Arial', 16, 'bold'),
            fg=COLORS['text'],
            bg=COLORS['menu_bg']
        )
        self.turn_label.pack(pady=20)
        
        # Estado del juego
        self.status_label = tk.Label(
            side_panel,
            text="",
            font=('Arial', 12),
            fg=COLORS['text_secondary'],
            bg=COLORS['menu_bg'],
            wraplength=250
        )
        self.status_label.pack(pady=10)
        
        # Botón nueva partida
        new_game_btn = tk.Button(
            side_panel,
            text="Nueva Partida",
            font=('Arial', 12, 'bold'),
            bg=COLORS['button'],
            fg='white',
            activebackground=COLORS['button_hover'],
            width=18,
            height=2,
            bd=0,
            cursor='hand2',
            command=lambda: self.start_game(self.game_mode)
        )
        new_game_btn.pack(pady=20)
        
        # Canvas del tablero
        board_size = 640
        self.square_size = board_size // 8
        
        board_frame = tk.Frame(board_container, bg=COLORS['bg'])
        board_frame.pack(side='left', padx=20, pady=20)
        
        self.canvas = tk.Canvas(
            board_frame,
            width=board_size,
            height=board_size,
            bg=COLORS['bg'],
            highlightthickness=2,
            highlightbackground=COLORS['menu_bg']
        )
        self.canvas.pack()
        
        self.canvas.bind('<Button-1>', self.on_square_click)
        
        self.draw_board()
        self.update_turn_label()
    
    def draw_board(self):
        """Dibuja el tablero de ajedrez"""
        self.canvas.delete('all')
        
        # Dibujar casillas
        for row in range(8):
            for col in range(8):
                x1 = col * self.square_size
                y1 = row * self.square_size
                x2 = x1 + self.square_size
                y2 = y1 + self.square_size
                
                # Color de la casilla
                is_light = (row + col) % 2 == 0
                
                # Verificar si está seleccionada o es un movimiento válido
                if self.selected_square == (row, col):
                    color = COLORS['selected']
                elif (row, col) in self.highlighted_moves:
                    color = COLORS['board_light_highlight'] if is_light else COLORS['board_dark_highlight']
                else:
                    color = COLORS['board_light'] if is_light else COLORS['board_dark']
                
                self.canvas.create_rectangle(
                    x1, y1, x2, y2,
                    fill=color,
                    outline=''
                )
                
                # Indicador de movimiento válido
                if (row, col) in self.highlighted_moves:
                    center_x = x1 + self.square_size // 2
                    center_y = y1 + self.square_size // 2
                    piece = self.chess_board.get_piece(row, col)
                    if piece:
                        # Círculo para captura
                        radius = self.square_size // 2 - 5
                        self.canvas.create_oval(
                            center_x - radius, center_y - radius,
                            center_x + radius, center_y + radius,
                            outline=COLORS['valid_move'],
                            width=4
                        )
                    else:
                        # Punto para movimiento
                        radius = self.square_size // 6
                        self.canvas.create_oval(
                            center_x - radius, center_y - radius,
                            center_x + radius, center_y + radius,
                            fill=COLORS['valid_move'],
                            outline=''
                        )
        
        # Coordenadas
        for i in range(8):
            # Números (filas)
            self.canvas.create_text(
                5,
                i * self.square_size + 5,
                text=str(8 - i),
                font=('Arial', 12, 'bold'),
                fill=COLORS['board_dark'] if i % 2 == 0 else COLORS['board_light'],
                anchor='nw'
            )
            # Letras (columnas)
            self.canvas.create_text(
                i * self.square_size + self.square_size - 5,
                8 * self.square_size - 20,
                text=chr(97 + i),
                font=('Arial', 12, 'bold'),
                fill=COLORS['board_light'] if i % 2 == 0 else COLORS['board_dark'],
                anchor='se'
            )
        
        # Dibujar piezas
        for row in range(8):
            for col in range(8):
                piece = self.chess_board.get_piece(row, col)
                if piece:
                    x = col * self.square_size + self.square_size // 2
                    y = row * self.square_size + self.square_size // 2
                    
                    symbol = PIECES_UNICODE.get(piece, piece)
                    color = 'white' if piece.isupper() else 'black'
                    
                    self.canvas.create_text(
                        x, y,
                        text=symbol,
                        font=('Arial', int(self.square_size * 0.7), 'bold'),
                        fill=color,
                        tags='piece'
                    )
        
        # Resaltar si hay jaque
        if self.chess_board.is_in_check(self.chess_board.white_turn):
            king = 'K' if self.chess_board.white_turn else 'k'
            for row in range(8):
                for col in range(8):
                    if self.chess_board.board[row][col] == king:
                        x1 = col * self.square_size
                        y1 = row * self.square_size
                        x2 = x1 + self.square_size
                        y2 = y1 + self.square_size
                        self.canvas.create_rectangle(
                            x1, y1, x2, y2,
                            outline=COLORS['check'],
                            width=4
                        )
    
    def on_square_click(self, event):
        """Maneja el clic en una casilla"""
        col = event.x // self.square_size
        row = event.y // self.square_size
        
        if not (0 <= row < 8 and 0 <= col < 8):
            return
        
        # Si hay una casilla seleccionada
        if self.selected_square:
            from_row, from_col = self.selected_square
            
            # Si hace clic en un movimiento válido
            if (row, col) in self.highlighted_moves:
                self.chess_board.make_move(from_row, from_col, row, col)
                self.selected_square = None
                self.highlighted_moves = []
                self.draw_board()
                self.update_turn_label()
                self.check_game_status()
                
                # Turno de la IA
                if self.game_mode == 'pvc' and not self.chess_board.white_turn:
                    self.root.after(500, self.ai_move)
            else:
                # Seleccionar otra pieza
                piece = self.chess_board.get_piece(row, col)
                if piece and ((self.chess_board.white_turn and self.chess_board.is_white(piece)) or
                             (not self.chess_board.white_turn and self.chess_board.is_black(piece))):
                    self.selected_square = (row, col)
                    self.highlighted_moves = self.chess_board.get_valid_moves(row, col)
                    self.draw_board()
                else:
                    self.selected_square = None
                    self.highlighted_moves = []
                    self.draw_board()
        else:
            # Seleccionar una pieza
            piece = self.chess_board.get_piece(row, col)
            if piece and ((self.chess_board.white_turn and self.chess_board.is_white(piece)) or
                         (not self.chess_board.white_turn and self.chess_board.is_black(piece))):
                self.selected_square = (row, col)
                self.highlighted_moves = self.chess_board.get_valid_moves(row, col)
                self.draw_board()
    
    def ai_move(self):
        """Realiza el movimiento de la IA"""
        move = self.ai.get_best_move(self.chess_board)
        if move:
            from_row, from_col, to_row, to_col = move
            self.chess_board.make_move(from_row, from_col, to_row, to_col)
            self.draw_board()
            self.update_turn_label()
            self.check_game_status()
    
    def update_turn_label(self):
        """Actualiza la etiqueta del turno"""
        turn_text = "Turno: Blancas ♔" if self.chess_board.white_turn else "Turno: Negras ♚"
        self.turn_label.config(text=turn_text)
        
        if self.chess_board.is_in_check(self.chess_board.white_turn):
            self.status_label.config(text="¡JAQUE!", fg=COLORS['check'])
        else:
            self.status_label.config(text="", fg=COLORS['text_secondary'])
    
    def check_game_status(self):
        """Verifica el estado del juego"""
        if self.chess_board.is_checkmate():
            winner = "Negras" if self.chess_board.white_turn else "Blancas"
            messagebox.showinfo(
                "¡Jaque Mate!",
                f"¡{winner} ganan por jaque mate!"
            )
            self.show_main_menu()
        elif self.chess_board.is_stalemate():
            messagebox.showinfo(
                "Tablas",
                "¡Partida terminada en tablas por ahogado!"
            )
            self.show_main_menu()
    
    def run(self):
        """Ejecuta el juego"""
        self.root.mainloop()


if __name__ == '__main__':
    game = ChessGame()
    game.run()
