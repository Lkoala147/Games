#!/usr/bin/env python3
"""
Juego de Ajedrez Profesional - Estilo Chess.com
Características: JcJ (Jugador vs Jugador) y JcIA (Jugador vs IA)
Interfaz oscura profesional
"""

import tkinter as tk
from tkinter import messagebox
import random
import os
import math
try:
    import winsound
except Exception:
    winsound = None

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

# Carpeta de piezas (PNGs) estilo Chess.com
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PIECE_IMAGE_DIR = os.path.join(BASE_DIR, "assets escacs")


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
        self.position_counts = {}
        self.position_history = []
        self._record_position()
        
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
        board_copy = [row[:] for row in self.board]
        en_passant_copy = self.en_passant_target
        piece = self.board[from_row][from_col]
        target = self.board[to_row][to_col]
        
        self.board[to_row][to_col] = piece
        self.board[from_row][from_col] = None

        # Simular captura en passant
        if piece and piece.upper() == 'P' and target is None and en_passant_copy == (to_row, to_col):
            captured_row = from_row
            self.board[captured_row][to_col] = None
        
        # Verificar si el rey queda en jaque
        is_legal = not self.is_in_check(self.is_white(piece))
        
        # Restaurar tablero
        self.board = board_copy
        self.en_passant_target = en_passant_copy
        
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
        
        return self._is_square_attacked(king_pos[0], king_pos[1], not white_king)
    
    def _is_square_attacked(self, row, col, by_white):
        """Verifica si una casilla está siendo atacada"""
        for r in range(8):
            for c in range(8):
                piece = self.board[r][c]
                if piece is None:
                    continue
                if (by_white and self.is_white(piece)) or (not by_white and self.is_black(piece)):
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
        is_pawn_move = piece.upper() == 'P'
        en_passant_prev = self.en_passant_target
        castling_state = (
            self.white_king_moved, self.black_king_moved,
            self.white_rook_a_moved, self.white_rook_h_moved,
            self.black_rook_a_moved, self.black_rook_h_moved
        )
        halfmove_prev = self.halfmove_clock
        fullmove_prev = self.fullmove_number
        white_turn_prev = self.white_turn
        captured_pos = None
        
        # Guardar en historial
        self.move_history.append({
            'from': (from_row, from_col),
            'to': (to_row, to_col),
            'piece': piece,
            'captured': captured,
            'en_passant': en_passant_prev,
            'captured_pos': captured_pos,
            'castling_state': castling_state,
            'halfmove_prev': halfmove_prev,
            'fullmove_prev': fullmove_prev,
            'white_turn_prev': white_turn_prev
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
            captured = 'p' if self.is_white(piece) else 'P'
            captured_pos = (captured_row, to_col)
        
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
        if not self.white_turn:
            self.fullmove_number += 1

        # Regla de 50 movimientos (contador de medio-movimientos)
        if is_pawn_move or captured is not None:
            self.halfmove_clock = 0
        else:
            self.halfmove_clock += 1

        self._record_position()
        
        return True

    def undo_move(self):
        """Deshace el último movimiento"""
        if not self.move_history:
            return False

        # Quitar conteo de la posición actual
        self._unrecord_position()

        last = self.move_history.pop()
        from_row, from_col = last['from']
        to_row, to_col = last['to']
        piece = last['piece']
        captured = last['captured']
        captured_pos = last['captured_pos']

        # Restaurar pieza movida
        self.board[from_row][from_col] = piece
        self.board[to_row][to_col] = None

        # Restaurar captura normal o en passant
        if captured is not None:
            if captured_pos:
                self.board[captured_pos[0]][captured_pos[1]] = captured
            else:
                self.board[to_row][to_col] = captured

        # Deshacer enroque si corresponde
        if piece.upper() == 'K' and abs(to_col - from_col) == 2:
            if to_col > from_col:  # Enroque corto
                rook = self.board[from_row][5]
                self.board[from_row][5] = None
                self.board[from_row][7] = rook
            else:  # Enroque largo
                rook = self.board[from_row][3]
                self.board[from_row][3] = None
                self.board[from_row][0] = rook

        # Restaurar estados
        self.en_passant_target = last['en_passant']
        (self.white_king_moved, self.black_king_moved,
         self.white_rook_a_moved, self.white_rook_h_moved,
         self.black_rook_a_moved, self.black_rook_h_moved) = last['castling_state']
        self.halfmove_clock = last['halfmove_prev']
        self.fullmove_number = last['fullmove_prev']
        self.white_turn = last['white_turn_prev']

        # Registrar la posición restaurada
        self._record_position()
        return True

    def _position_key(self):
        """Genera una clave de posición para repetición"""
        board_str = ''.join(
            (piece if piece else '.') for row in self.board for piece in row
        )
        turn = 'w' if self.white_turn else 'b'
        castling = ''
        if not self.white_king_moved and not self.white_rook_h_moved:
            castling += 'K'
        if not self.white_king_moved and not self.white_rook_a_moved:
            castling += 'Q'
        if not self.black_king_moved and not self.black_rook_h_moved:
            castling += 'k'
        if not self.black_king_moved and not self.black_rook_a_moved:
            castling += 'q'
        if castling == '':
            castling = '-'
        ep = '-'
        if self.en_passant_target:
            ep = f"{chr(97 + self.en_passant_target[1])}{8 - self.en_passant_target[0]}"
        return f"{board_str} {turn} {castling} {ep}"

    def _record_position(self):
        key = self._position_key()
        self.position_history.append(key)
        self.position_counts[key] = self.position_counts.get(key, 0) + 1

    def _unrecord_position(self):
        if not self.position_history:
            return
        key = self.position_history.pop()
        if key in self.position_counts:
            self.position_counts[key] -= 1
            if self.position_counts[key] <= 0:
                del self.position_counts[key]

    def is_threefold_repetition(self):
        """Verifica repetición triple"""
        key = self._position_key()
        return self.position_counts.get(key, 0) >= 3
    
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

    def __init__(self, difficulty='medium', is_white=False):
        self.difficulty = difficulty
        self.is_white = is_white
        
        # Valores de las piezas
        self.piece_values = {
            'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000,
            'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000
        }
    
    def get_best_move(self, chess_board):
        """Obtiene el mejor movimiento para la IA"""
        all_moves = self._get_all_moves(chess_board, self.is_white)

        if not all_moves:
            return None

        if self.difficulty == 'easy':
            return random.choice(all_moves)

        if self.difficulty == 'hard':
            # Profundidad mayor para analizar respuesta del rival
            return self._minimax_root(chess_board, depth=3)

        # medium: evaluación simple a 1 movimiento
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
        board_copy = [row[:] for row in chess_board.board]
        piece = chess_board.board[from_row][from_col]
        captured = chess_board.board[to_row][to_col]
        
        chess_board.board[to_row][to_col] = piece
        chess_board.board[from_row][from_col] = None
        
        # Valor de captura
        if captured:
            score += self.piece_values.get(captured, 0)
        
        # Penalizar si deja al propio rey en jaque
        if chess_board.is_in_check(self.is_white):
            score -= 500

        # Bonificar si pone al enemigo en jaque
        if chess_board.is_in_check(not self.is_white):
            score += 50
        
        # Control del centro
        if 2 <= to_row <= 5 and 2 <= to_col <= 5:
            score += 10
        
        # Restaurar tablero
        chess_board.board = board_copy
        
        return score

    def _get_all_moves(self, chess_board, for_white):
        """Lista todos los movimientos legales para un color"""
        all_moves = []
        original_turn = chess_board.white_turn
        chess_board.white_turn = for_white
        try:
            for row in range(8):
                for col in range(8):
                    piece = chess_board.board[row][col]
                    if piece and ((for_white and chess_board.is_white(piece)) or
                                 (not for_white and chess_board.is_black(piece))):
                        valid_moves = chess_board.get_valid_moves(row, col)
                        for to_row, to_col in valid_moves:
                            all_moves.append((row, col, to_row, to_col))
        finally:
            chess_board.white_turn = original_turn
        return all_moves

    def _minimax_root(self, chess_board, depth):
        """Raíz minimax con profundidad fija"""
        best_move = None
        best_score = float('-inf')
        moves = self._order_moves(self._get_all_moves(chess_board, self.is_white), chess_board)
        for from_row, from_col, to_row, to_col in moves:
            board_copy = [row[:] for row in chess_board.board]
            white_turn_copy = chess_board.white_turn

            chess_board.board[to_row][to_col] = chess_board.board[from_row][from_col]
            chess_board.board[from_row][from_col] = None

            score = self._minimax(chess_board, depth - 1, False, float('-inf'), float('inf'))

            chess_board.board = board_copy
            chess_board.white_turn = white_turn_copy

            if score > best_score:
                best_score = score
                best_move = (from_row, from_col, to_row, to_col)
        return best_move

    def _minimax(self, chess_board, depth, is_max, alpha, beta):
        """Minimax con poda alfa-beta"""
        if depth == 0:
            return self._evaluate_board(chess_board)

        current_color = self.is_white if is_max else not self.is_white
        moves = self._order_moves(self._get_all_moves(chess_board, current_color), chess_board)
        if not moves:
            # Sin movimientos: jaque mate o tablas
            if chess_board.is_in_check(current_color):
                return 100000 if not is_max else -100000
            return self._evaluate_board(chess_board)

        if is_max:
            best = float('-inf')
            for from_row, from_col, to_row, to_col in moves:
                board_copy = [row[:] for row in chess_board.board]
                white_turn_copy = chess_board.white_turn

                chess_board.board[to_row][to_col] = chess_board.board[from_row][from_col]
                chess_board.board[from_row][from_col] = None

                best = max(best, self._minimax(chess_board, depth - 1, False, alpha, beta))

                chess_board.board = board_copy
                chess_board.white_turn = white_turn_copy
                alpha = max(alpha, best)
                if beta <= alpha:
                    break
            return best
        else:
            best = float('inf')
            for from_row, from_col, to_row, to_col in moves:
                board_copy = [row[:] for row in chess_board.board]
                white_turn_copy = chess_board.white_turn

                chess_board.board[to_row][to_col] = chess_board.board[from_row][from_col]
                chess_board.board[from_row][from_col] = None

                best = min(best, self._minimax(chess_board, depth - 1, True, alpha, beta))

                chess_board.board = board_copy
                chess_board.white_turn = white_turn_copy
                beta = min(beta, best)
                if beta <= alpha:
                    break
            return best

    def _order_moves(self, moves, chess_board):
        """Ordena movimientos para mejorar la poda (capturas primero)"""
        def capture_value(mv):
            _, _, to_row, to_col = mv
            target = chess_board.board[to_row][to_col]
            return self.piece_values.get(target, 0) if target else 0
        return sorted(moves, key=capture_value, reverse=True)

    def _evaluate_board(self, chess_board):
        """Evalúa el tablero desde la perspectiva de la IA"""
        score = 0
        for r in range(8):
            for c in range(8):
                piece = chess_board.board[r][c]
                if piece is None:
                    continue
                value = self.piece_values.get(piece, 0)
                if piece.isupper() == self.is_white:
                    score += value
                else:
                    score -= value
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
        self.player_is_white = True
        self.ai_difficulty = 'medium'
        self.selected_square = None
        self.highlighted_moves = []
        self.board_flipped = False
        
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
            command=lambda: self.show_color_menu('pvp')
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
            command=lambda: self.show_color_menu('pvc')
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
    
    def show_color_menu(self, mode):
        """Muestra el menú para elegir color"""
        # Limpiar ventana
        for widget in self.root.winfo_children():
            widget.destroy()

        # Frame principal
        main_frame = tk.Frame(self.root, bg=COLORS['menu_bg'])
        main_frame.pack(expand=True, fill='both')

        # Título
        title_label = tk.Label(
            main_frame,
            text="Elige tu color",
            font=('Arial', 36, 'bold'),
            fg=COLORS['text'],
            bg=COLORS['menu_bg']
        )
        title_label.pack(pady=40)

        # Botones de color
        button_frame = tk.Frame(main_frame, bg=COLORS['menu_bg'])
        button_frame.pack(pady=30)

        white_btn = tk.Button(
            button_frame,
            text="Jugar con Blancas",
            font=('Arial', 18, 'bold'),
            bg=COLORS['button'],
            fg='white',
            activebackground=COLORS['button_hover'],
            width=22,
            height=2,
            bd=0,
            cursor='hand2',
            command=lambda: self.start_game(mode, player_is_white=True) if mode == 'pvp'
            else self.show_difficulty_menu(mode, player_is_white=True)
        )
        white_btn.pack(pady=10)

        black_btn = tk.Button(
            button_frame,
            text="Jugar con Negras",
            font=('Arial', 18, 'bold'),
            bg=COLORS['button'],
            fg='white',
            activebackground=COLORS['button_hover'],
            width=22,
            height=2,
            bd=0,
            cursor='hand2',
            command=lambda: self.start_game(mode, player_is_white=False) if mode == 'pvp'
            else self.show_difficulty_menu(mode, player_is_white=False)
        )
        black_btn.pack(pady=10)

        # Botón volver
        back_btn = tk.Button(
            main_frame,
            text="← Volver",
            font=('Arial', 12),
            bg=COLORS['menu_hover'],
            fg=COLORS['text'],
            bd=0,
            cursor='hand2',
            command=self.show_main_menu
        )
        back_btn.pack(side='bottom', pady=20)

        # Efectos hover
        def on_enter(e, btn):
            btn.config(bg=COLORS['button_hover'])

        def on_leave(e, btn):
            btn.config(bg=COLORS['button'])

        white_btn.bind('<Enter>', lambda e: on_enter(e, white_btn))
        white_btn.bind('<Leave>', lambda e: on_leave(e, white_btn))
        black_btn.bind('<Enter>', lambda e: on_enter(e, black_btn))
        black_btn.bind('<Leave>', lambda e: on_leave(e, black_btn))

    def show_difficulty_menu(self, mode, player_is_white):
        """Muestra el menú para elegir dificultad de IA"""
        # Limpiar ventana
        for widget in self.root.winfo_children():
            widget.destroy()

        # Frame principal
        main_frame = tk.Frame(self.root, bg=COLORS['menu_bg'])
        main_frame.pack(expand=True, fill='both')

        # Título
        title_label = tk.Label(
            main_frame,
            text="Elige dificultad",
            font=('Arial', 36, 'bold'),
            fg=COLORS['text'],
            bg=COLORS['menu_bg']
        )
        title_label.pack(pady=40)

        # Botones de dificultad
        button_frame = tk.Frame(main_frame, bg=COLORS['menu_bg'])
        button_frame.pack(pady=30)

        def choose_difficulty(level):
            self.ai_difficulty = level
            self.start_game(mode, player_is_white=player_is_white)

        easy_btn = tk.Button(
            button_frame,
            text="Fácil",
            font=('Arial', 18, 'bold'),
            bg=COLORS['button'],
            fg='white',
            activebackground=COLORS['button_hover'],
            width=22,
            height=2,
            bd=0,
            cursor='hand2',
            command=lambda: choose_difficulty('easy')
        )
        easy_btn.pack(pady=10)

        medium_btn = tk.Button(
            button_frame,
            text="Medio",
            font=('Arial', 18, 'bold'),
            bg=COLORS['button'],
            fg='white',
            activebackground=COLORS['button_hover'],
            width=22,
            height=2,
            bd=0,
            cursor='hand2',
            command=lambda: choose_difficulty('medium')
        )
        medium_btn.pack(pady=10)

        hard_btn = tk.Button(
            button_frame,
            text="Difícil",
            font=('Arial', 18, 'bold'),
            bg=COLORS['button'],
            fg='white',
            activebackground=COLORS['button_hover'],
            width=22,
            height=2,
            bd=0,
            cursor='hand2',
            command=lambda: choose_difficulty('hard')
        )
        hard_btn.pack(pady=10)

        # Botón volver
        back_btn = tk.Button(
            main_frame,
            text="← Volver",
            font=('Arial', 12),
            bg=COLORS['menu_hover'],
            fg=COLORS['text'],
            bd=0,
            cursor='hand2',
            command=lambda: self.show_color_menu(mode)
        )
        back_btn.pack(side='bottom', pady=20)

        # Efectos hover
        def on_enter(e, btn):
            btn.config(bg=COLORS['button_hover'])

        def on_leave(e, btn):
            btn.config(bg=COLORS['button'])

        easy_btn.bind('<Enter>', lambda e: on_enter(e, easy_btn))
        easy_btn.bind('<Leave>', lambda e: on_leave(e, easy_btn))
        medium_btn.bind('<Enter>', lambda e: on_enter(e, medium_btn))
        medium_btn.bind('<Leave>', lambda e: on_leave(e, medium_btn))
        hard_btn.bind('<Enter>', lambda e: on_enter(e, hard_btn))
        hard_btn.bind('<Leave>', lambda e: on_leave(e, hard_btn))

    def start_game(self, mode, player_is_white=True):
        """Inicia una nueva partida"""
        self.game_mode = mode
        self.player_is_white = player_is_white
        self.chess_board.reset_board()
        self.selected_square = None
        self.highlighted_moves = []
        if getattr(self, "history_listbox", None):
            self.history_listbox.delete(0, 'end')
        self.ai.is_white = not self.player_is_white
        self.ai.difficulty = self.ai_difficulty
        # Girar tablero automáticamente si juegas con negras
        self.board_flipped = not self.player_is_white
        self.show_game_board()

        # En PvP, siempre empiezan las blancas
        if self.game_mode == 'pvp':
            self.chess_board.white_turn = True
            self.update_turn_label()

        # Si el jugador eligió negras, la IA (blancas) mueve primero
        if self.game_mode == 'pvc' and not self.player_is_white:
            self.root.after(500, self.ai_move)
    
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
        board_container.pack(expand=True, fill='both')
        board_container.grid_rowconfigure(0, weight=1)
        board_container.grid_columnconfigure(0, weight=1)
        board_container.grid_columnconfigure(1, weight=0)
        
        # Panel lateral
        side_panel = tk.Frame(board_container, bg=COLORS['menu_bg'], width=300)
        side_panel.grid(row=0, column=1, sticky='ns', padx=20, pady=20)
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

        # Info de jugadores (solo en PvP)
        player_info_text = ""
        if self.game_mode == 'pvp':
            color_text = "Blancas" if self.player_is_white else "Negras"
            player_info_text = f"Jugador 1: {color_text}"
        self.player_info_label = tk.Label(
            side_panel,
            text=player_info_text,
            font=('Arial', 12, 'bold'),
            fg=COLORS['text_secondary'],
            bg=COLORS['menu_bg'],
            wraplength=250
        )
        self.player_info_label.pack(pady=5)

        player2_text = ""
        if self.game_mode == 'pvp':
            color_text = "Negras" if self.player_is_white else "Blancas"
            player2_text = f"Jugador 2: {color_text}"
        self.player2_info_label = tk.Label(
            side_panel,
            text=player2_text,
            font=('Arial', 12, 'bold'),
            fg=COLORS['text_secondary'],
            bg=COLORS['menu_bg'],
            wraplength=250
        )
        self.player2_info_label.pack(pady=2)
        
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

        # Contador regla 50 movimientos
        self.fifty_move_label = tk.Label(
            side_panel,
            text="Regla 50: 0/100",
            font=('Arial', 11, 'bold'),
            fg=COLORS['text_secondary'],
            bg=COLORS['menu_bg']
        )
        self.fifty_move_label.pack(pady=5)

        # Aviso de piezas faltantes
        missing_text = ""
        if getattr(self, "missing_piece_files", None):
            missing_text = "Faltan imágenes:\n" + ", ".join(self.missing_piece_files)
        self.missing_label = tk.Label(
            side_panel,
            text=missing_text,
            font=('Arial', 10),
            fg=COLORS['check'] if missing_text else COLORS['text_secondary'],
            bg=COLORS['menu_bg'],
            wraplength=250,
            justify='left'
        )
        self.missing_label.pack(pady=5)

        # Historial de jugadas
        history_label = tk.Label(
            side_panel,
            text="Historial",
            font=('Arial', 12, 'bold'),
            fg=COLORS['text_secondary'],
            bg=COLORS['menu_bg']
        )
        history_label.pack(pady=(10, 5))

        history_frame = tk.Frame(side_panel, bg=COLORS['menu_bg'])
        history_frame.pack(fill='x', padx=10, pady=5)

        self.history_listbox = tk.Listbox(
            history_frame,
            height=10,
            bg=COLORS['menu_bg'],
            fg=COLORS['text'],
            highlightthickness=1,
            highlightbackground=COLORS['menu_hover'],
            selectbackground=COLORS['menu_hover'],
            activestyle='none'
        )
        self.history_listbox.pack(side='left', fill='both', expand=True)

        history_scroll = tk.Scrollbar(history_frame, command=self.history_listbox.yview)
        history_scroll.pack(side='right', fill='y')
        self.history_listbox.config(yscrollcommand=history_scroll.set)
        
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

        # Botón deshacer
        undo_btn = tk.Button(
            side_panel,
            text="Deshacer",
            font=('Arial', 12, 'bold'),
            bg=COLORS['menu_hover'],
            fg=COLORS['text'],
            activebackground=COLORS['menu_bg'],
            width=18,
            height=2,
            bd=0,
            cursor='hand2',
            command=self.undo_last_move
        )
        undo_btn.pack(pady=10)

        # Botón girar tablero
        flip_btn = tk.Button(
            side_panel,
            text="Girar Tablero",
            font=('Arial', 12, 'bold'),
            bg=COLORS['menu_hover'],
            fg=COLORS['text'],
            activebackground=COLORS['menu_bg'],
            width=18,
            height=2,
            bd=0,
            cursor='hand2',
            command=self.toggle_board_flip
        )
        flip_btn.pack(pady=10)
        
        # Canvas del tablero
        board_frame = tk.Frame(board_container, bg=COLORS['bg'])
        board_frame.grid(row=0, column=0, sticky='nsew', padx=20, pady=20)
        board_frame.grid_rowconfigure(0, weight=1)
        board_frame.grid_columnconfigure(0, weight=1)

        self.board_size = 640
        self.square_size = self.board_size // 8
        self._load_piece_images()
        
        self.canvas = tk.Canvas(
            board_frame,
            width=self.board_size,
            height=self.board_size,
            bg=COLORS['bg'],
            highlightthickness=2,
            highlightbackground=COLORS['menu_bg']
        )
        self.canvas.grid(row=0, column=0)
        
        self.canvas.bind('<Button-1>', self.on_square_click)
        
        self.draw_board()
        self.update_turn_label()

        # Redimensionado responsivo
        self._resize_job = None
        self.root.bind('<Configure>', self._on_resize)

    def _on_resize(self, event):
        """Redimensiona el tablero al cambiar tamaño de ventana"""
        if event.widget != self.root:
            return
        if self._resize_job:
            self.root.after_cancel(self._resize_job)
        self._resize_job = self.root.after(50, self._update_board_size)

    def _update_board_size(self):
        """Calcula y aplica el tamaño del tablero según la ventana"""
        self.root.update_idletasks()
        window_width = self.root.winfo_width()
        window_height = self.root.winfo_height()

        top_panel_height = 60
        side_panel_width = 300
        padding_x = 20 * 3  # left + gap + right
        padding_y = 20 * 2  # top + bottom

        available_width = max(320, window_width - side_panel_width - padding_x)
        available_height = max(320, window_height - top_panel_height - padding_y)
        new_board_size = int(min(available_width, available_height))

        if new_board_size < 320:
            new_board_size = 320

        if new_board_size != getattr(self, "board_size", 0):
            self.board_size = new_board_size
            self.square_size = self.board_size // 8
            self.canvas.config(width=self.board_size, height=self.board_size)
            self._load_piece_images()
            self.draw_board()
    
    def draw_board(self):
        """Dibuja el tablero de ajedrez"""
        self.canvas.delete('all')
        
        # Dibujar casillas
        for row in range(8):
            for col in range(8):
                board_row, board_col = self._view_to_board(row, col)
                x1 = col * self.square_size
                y1 = row * self.square_size
                x2 = x1 + self.square_size
                y2 = y1 + self.square_size
                
                # Color de la casilla
                is_light = (row + col) % 2 == 0
                
                # Verificar si está seleccionada o es un movimiento válido
                if self.selected_square == (board_row, board_col):
                    color = COLORS['selected']
                elif (board_row, board_col) in self.highlighted_moves:
                    color = COLORS['board_light_highlight'] if is_light else COLORS['board_dark_highlight']
                else:
                    color = COLORS['board_light'] if is_light else COLORS['board_dark']
                
                self.canvas.create_rectangle(
                    x1, y1, x2, y2,
                    fill=color,
                    outline=''
                )
                
                # Indicador de movimiento válido
                if (board_row, board_col) in self.highlighted_moves:
                    center_x = x1 + self.square_size // 2
                    center_y = y1 + self.square_size // 2
                    piece = self.chess_board.get_piece(board_row, board_col)
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
                text=str(i + 1) if self.board_flipped else str(8 - i),
                font=('Arial', 12, 'bold'),
                fill=COLORS['board_dark'] if i % 2 == 0 else COLORS['board_light'],
                anchor='nw'
            )
            # Letras (columnas)
            self.canvas.create_text(
                i * self.square_size + self.square_size - 5,
                8 * self.square_size - 20,
                text=chr(97 + (7 - i)) if self.board_flipped else chr(97 + i),
                font=('Arial', 12, 'bold'),
                fill=COLORS['board_light'] if i % 2 == 0 else COLORS['board_dark'],
                anchor='se'
            )
        
        # Dibujar piezas
        for row in range(8):
            for col in range(8):
                board_row, board_col = self._view_to_board(row, col)
                piece = self.chess_board.get_piece(board_row, board_col)
                if piece:
                    x = col * self.square_size + self.square_size // 2
                    y = row * self.square_size + self.square_size // 2

                    img = self.piece_images.get(piece)
                    if img is not None:
                        self.canvas.create_image(x, y, image=img, tags='piece')
                    else:
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
                        view_row, view_col = self._board_to_view(row, col)
                        x1 = view_col * self.square_size
                        y1 = view_row * self.square_size
                        x2 = x1 + self.square_size
                        y2 = y1 + self.square_size
                        self.canvas.create_rectangle(
                            x1, y1, x2, y2,
                            outline=COLORS['check'],
                            width=4
                        )
    
    def on_square_click(self, event):
        """Maneja el clic en una casilla"""
        if getattr(self, "promotion_active", False):
            return
        if self.game_mode == 'pvc':
            # Bloquear interacción si no es el turno del jugador
            if self.chess_board.white_turn != self.player_is_white:
                return

        view_col = event.x // self.square_size
        view_row = event.y // self.square_size
        row, col = self._view_to_board(view_row, view_col)
        
        if not (0 <= row < 8 and 0 <= col < 8):
            return
        
        # Si hay una casilla seleccionada
        if self.selected_square:
            from_row, from_col = self.selected_square
            moved_piece = self.chess_board.get_piece(from_row, from_col)
            
            # Si hace clic en un movimiento válido
            if (row, col) in self.highlighted_moves:
                target_piece = self.chess_board.get_piece(row, col)
                en_passant_capture = (
                    moved_piece and moved_piece.upper() == 'P' and target_piece is None and
                    self.chess_board.en_passant_target == (row, col)
                )
                capture = target_piece is not None or en_passant_capture
                self.chess_board.make_move(from_row, from_col, row, col)
                # Promoción de peón elegida por el jugador
                if moved_piece and moved_piece.upper() == 'P' and (row == 0 or row == 7):
                    promotion_piece = self._choose_promotion(moved_piece.isupper())
                    self.chess_board.board[row][col] = promotion_piece
                self.selected_square = None
                self.highlighted_moves = []
                self.draw_board()
                self.update_turn_label()
                self._post_move_updates(from_row, from_col, row, col, capture)
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
            moved_piece = self.chess_board.get_piece(from_row, from_col)
            target_piece = self.chess_board.get_piece(to_row, to_col)
            en_passant_capture = (
                moved_piece and moved_piece.upper() == 'P' and target_piece is None and
                self.chess_board.en_passant_target == (to_row, to_col)
            )
            capture = target_piece is not None or en_passant_capture
            self.chess_board.make_move(from_row, from_col, to_row, to_col)
            self.draw_board()
            self.update_turn_label()
            self._post_move_updates(from_row, from_col, to_row, to_col, capture)
            self.check_game_status()

    def undo_last_move(self):
        """Deshace la última jugada (en PvC deshace 2 para volver al jugador)"""
        if getattr(self, "promotion_active", False):
            return
        if self.game_mode == 'pvc':
            undone = 0
            while undone < 2 and self.chess_board.move_history:
                if not self.chess_board.undo_move():
                    break
                undone += 1
                if getattr(self, "history_listbox", None) and self.history_listbox.size() > 0:
                    self.history_listbox.delete('end')
        else:
            if self.chess_board.undo_move():
                if getattr(self, "history_listbox", None) and self.history_listbox.size() > 0:
                    self.history_listbox.delete('end')

        self.selected_square = None
        self.highlighted_moves = []
        self.draw_board()
        self.update_turn_label()
    
    def update_turn_label(self):
        """Actualiza la etiqueta del turno"""
        turn_text = "Turno: Blancas ♔" if self.chess_board.white_turn else "Turno: Negras ♚"
        self.turn_label.config(text=turn_text)
        if getattr(self, "fifty_move_label", None):
            self.fifty_move_label.config(
                text=f"Regla 50: {self.chess_board.halfmove_clock}/100"
            )
        
        if self.chess_board.is_in_check(self.chess_board.white_turn):
            self.status_label.config(text="¡JAQUE!", fg=COLORS['check'])
        else:
            self.status_label.config(text="", fg=COLORS['text_secondary'])

        # Resaltar jugador activo en PvP
        if self.game_mode == 'pvp':
            # Base labels
            if self.player_is_white:
                p1_base = "Jugador 1: Blancas"
                p2_base = "Jugador 2: Negras"
            else:
                p1_base = "Jugador 1: Negras"
                p2_base = "Jugador 2: Blancas"

            if self.chess_board.white_turn:
                # Turno de blancas
                if self.player_is_white:
                    self.player_info_label.config(text=p1_base, fg=COLORS['text'])
                    self.player2_info_label.config(text=p2_base, fg=COLORS['text_secondary'])
                else:
                    self.player_info_label.config(text=p1_base, fg=COLORS['text_secondary'])
                    self.player2_info_label.config(text=p2_base, fg=COLORS['text'])
            else:
                # Turno de negras
                if self.player_is_white:
                    self.player_info_label.config(text=p1_base, fg=COLORS['text_secondary'])
                    self.player2_info_label.config(text=p2_base, fg=COLORS['text'])
                else:
                    self.player_info_label.config(text=p1_base, fg=COLORS['text'])
                    self.player2_info_label.config(text=p2_base, fg=COLORS['text_secondary'])
    
    def check_game_status(self):
        """Verifica el estado del juego"""
        if self.chess_board.is_checkmate():
            winner = "Negras" if self.chess_board.white_turn else "Blancas"
            self._show_center_message(f"¡{winner} ganan por jaque mate!", "checkmate")
        elif self.chess_board.is_stalemate():
            self._show_center_message("¡Partida terminada en tablas por ahogado!", "stalemate")
        elif self.chess_board.is_threefold_repetition():
            self._show_center_message("¡Tablas por repetición triple!", "stalemate")
        elif self.chess_board.halfmove_clock >= 100:
            self._show_center_message("¡Tablas por regla de 50 movimientos!", "stalemate")

    def _post_move_updates(self, from_row, from_col, to_row, to_col, capture):
        """Actualiza historial y sonidos tras un movimiento"""
        self._append_history(from_row, from_col, to_row, to_col, capture)
        in_check = self.chess_board.is_in_check(self.chess_board.white_turn)
        if in_check:
            self._play_sound('check')
        elif capture:
            self._play_sound('capture')
        else:
            self._play_sound('move')

    def _append_history(self, from_row, from_col, to_row, to_col, capture):
        """Añade una jugada al historial en coordenadas"""
        if not getattr(self, "history_listbox", None):
            return
        total_plies = len(self.chess_board.move_history)
        move_number = (total_plies + 1) // 2
        is_white_move = total_plies % 2 == 1

        def coord(r, c):
            return f"{chr(97 + c)}{8 - r}"

        sep = "x" if capture else "-"
        text = f"{coord(from_row, from_col)}{sep}{coord(to_row, to_col)}"
        prefix = f"{move_number}. " if is_white_move else f"{move_number}... "
        self.history_listbox.insert('end', prefix + text)
        self.history_listbox.yview_moveto(1)

    def _play_sound(self, kind):
        """Reproduce un sonido simple del sistema"""
        if winsound is None:
            return
        if kind == 'check':
            winsound.Beep(1000, 180)
            winsound.Beep(1200, 180)
        elif kind == 'capture':
            winsound.Beep(700, 120)
        else:
            winsound.Beep(500, 80)

    def _choose_promotion(self, is_white):
        """Muestra un diálogo para elegir promoción"""
        result = tk.StringVar(value="")
        self.promotion_active = True
        self.promotion_frame = tk.Frame(self.root, bg=COLORS['menu_bg'], bd=2, relief='ridge')
        self.promotion_frame.place(relx=0.5, rely=0.5, anchor='center')

        label = tk.Label(
            self.promotion_frame,
            text="Elige la pieza de promoción",
            font=('Arial', 14, 'bold'),
            fg=COLORS['text'],
            bg=COLORS['menu_bg']
        )
        label.pack(padx=20, pady=15)

        btn_frame = tk.Frame(self.promotion_frame, bg=COLORS['menu_bg'])
        btn_frame.pack(padx=20, pady=10)

        choices = [('Q', 'Reina'), ('R', 'Torre'), ('B', 'Alfil'), ('N', 'Caballo')]
        self._promotion_btn_images = []
        for code, name in choices:
            def choose(c=code):
                result.set(c if is_white else c.lower())
                if self.promotion_frame:
                    self.promotion_frame.destroy()
                self.promotion_frame = None
                self.promotion_active = False
            piece_key = code if is_white else code.lower()
            img = self.piece_images.get(piece_key)
            btn = tk.Button(
                btn_frame,
                text="" if img else name,
                font=('Arial', 12, 'bold'),
                bg=COLORS['button'],
                fg='white',
                activebackground=COLORS['button_hover'],
                width=64 if img else 10,
                height=64 if img else 1,
                bd=0,
                cursor='hand2',
                command=choose,
                image=img,
                compound='top'
            )
            if img:
                self._promotion_btn_images.append(img)
            btn.pack(pady=5)

        self.root.wait_variable(result)
        return result.get() or ('Q' if is_white else 'q')

    def _show_center_message(self, text, reason):
        """Muestra un mensaje grande centrado en la pantalla"""
        if getattr(self, "center_message_frame", None):
            self.center_message_frame.destroy()

        self.center_message_frame = tk.Frame(self.root, bg=COLORS['menu_bg'], bd=2, relief='ridge')
        self.center_message_frame.place(relx=0.5, rely=0.5, anchor='center')

        title = "¡Jaque Mate!" if reason == "checkmate" else "Tablas"
        title_label = tk.Label(
            self.center_message_frame,
            text=title,
            font=('Arial', 24, 'bold'),
            fg=COLORS['text'],
            bg=COLORS['menu_bg']
        )
        title_label.pack(padx=30, pady=(20, 10))

        text_label = tk.Label(
            self.center_message_frame,
            text=text,
            font=('Arial', 16, 'bold'),
            fg=COLORS['text_secondary'],
            bg=COLORS['menu_bg'],
            wraplength=420,
            justify='center'
        )
        text_label.pack(padx=30, pady=(0, 20))

        btn = tk.Button(
            self.center_message_frame,
            text="Volver al menú",
            font=('Arial', 12, 'bold'),
            bg=COLORS['button'],
            fg='white',
            activebackground=COLORS['button_hover'],
            width=18,
            height=2,
            bd=0,
            cursor='hand2',
            command=self.show_main_menu
        )
        btn.pack(pady=(0, 20))

    def toggle_board_flip(self):
        """Gira el tablero"""
        self.board_flipped = not self.board_flipped
        self.draw_board()

    def _view_to_board(self, view_row, view_col):
        """Convierte coordenadas de vista a tablero"""
        if self.board_flipped:
            return 7 - view_row, 7 - view_col
        return view_row, view_col

    def _board_to_view(self, board_row, board_col):
        """Convierte coordenadas de tablero a vista"""
        if self.board_flipped:
            return 7 - board_row, 7 - board_col
        return board_row, board_col

    def _load_piece_images(self):
        """Carga y escala las imágenes de las piezas si existen"""
        self.piece_images = {}
        self.missing_piece_files = []

        piece_files = {
            'K': 'wK.png', 'Q': 'wQ.png', 'R': 'wR.png', 'B': 'wB.png', 'N': 'wN.png', 'P': 'wP.png',
            'k': 'bK.png', 'q': 'bQ.png', 'r': 'bR.png', 'b': 'bB.png', 'n': 'bN.png', 'p': 'bP.png'
        }

        target = int(self.square_size * 0.85)
        for piece, filename in piece_files.items():
            path = os.path.join(PIECE_IMAGE_DIR, filename)
            if not os.path.isfile(path):
                self.missing_piece_files.append(filename)
                continue

            img = tk.PhotoImage(file=path)
            width = img.width()
            height = img.height()

            # Reducir si es más grande que la casilla
            scale = max(1, math.ceil(max(width / target, height / target)))
            if scale > 1:
                img = img.subsample(scale, scale)

            self.piece_images[piece] = img

        if self.missing_piece_files:
            print("Faltan imágenes de piezas:", ", ".join(self.missing_piece_files))
    
    def run(self):
        """Ejecuta el juego"""
        self.root.mainloop()


if __name__ == '__main__':
    game = ChessGame()
    game.run()
