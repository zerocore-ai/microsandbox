package uuid

import (
	"crypto/rand"
	"database/sql/driver"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
)

type UUID [16]byte

var Nil UUID

// Errors
var (
	ErrInvalidUUIDFormat = errors.New("invalid UUID format")
	ErrInvalidLength     = errors.New("invalid UUID length")
)

func NewUUIDv4() (UUID, error) {
	var u UUID
	_, err := io.ReadFull(rand.Reader, u[:])
	if err != nil {
		return Nil, err
	}
	u[6] = (u[6] & 0x0f) | 0x40
	u[8] = (u[8] & 0x3f) | 0x80
	return u, nil
}

func MustUUIDv4() UUID {
	u, err := NewUUIDv4()
	if err != nil {
		panic(err)
	}
	return u
}

func (u UUID) String() string {
	var buf [36]byte
	encodeHex(buf[:], u)
	return string(buf[:])
}

func Parse(s string) (UUID, error) {
	var u UUID
	if len(s) != 36 {
		return Nil, ErrInvalidLength
	}
	if s[8] != '-' || s[13] != '-' || s[18] != '-' || s[23] != '-' {
		return Nil, ErrInvalidUUIDFormat
	}

	for i, x := range []int{0, 2, 4, 6, 9, 11, 14, 16, 19, 21, 24, 26, 28, 30, 32, 34} {
		v, ok := xtob(s[x], s[x+1])
		if !ok {
			return Nil, ErrInvalidUUIDFormat
		}
		u[i] = v
	}
	return u, nil
}

func MustParse(s string) UUID {
	u, err := Parse(s)
	if err != nil {
		panic(err)
	}
	return u
}

func Validate(s string) error {
	_, err := Parse(s)
	return err
}

func (u UUID) MarshalText() ([]byte, error) {
	var buf [36]byte
	encodeHex(buf[:], u)
	return buf[:], nil
}

func (u *UUID) UnmarshalText(data []byte) error {
	id, err := Parse(string(data))
	if err != nil {
		return err
	}
	*u = id
	return nil
}

func (u UUID) MarshalBinary() ([]byte, error) {
	return u[:], nil
}

func (u *UUID) UnmarshalBinary(data []byte) error {
	if len(data) != 16 {
		return ErrInvalidLength
	}
	copy(u[:], data)
	return nil
}

func (u UUID) Value() (driver.Value, error) {
	return u.String(), nil
}

func (u *UUID) Scan(src interface{}) error {
	switch src := src.(type) {
	case UUID:
		*u = src
		return nil
	case []byte:
		if len(src) == 16 {
			copy(u[:], src)
			return nil
		}
		return u.UnmarshalText(src)
	case string:
		return u.UnmarshalText([]byte(src))
	case nil:
		*u = Nil
		return nil
	}
	return fmt.Errorf("uuid: cannot convert %T to UUID", src)
}

func (u UUID) Version() int {
	return int(u[6] >> 4)
}

func (u UUID) Variant() int {
	return int((u[8] >> 5) ^ 0x04)
}

func encodeHex(dst []byte, u UUID) {
	hex.Encode(dst[0:8], u[0:4])
	dst[8] = '-'
	hex.Encode(dst[9:13], u[4:6])
	dst[13] = '-'
	hex.Encode(dst[14:18], u[6:8])
	dst[18] = '-'
	hex.Encode(dst[19:23], u[8:10])
	dst[23] = '-'
	hex.Encode(dst[24:], u[10:])
}

func xtob(a, b byte) (byte, bool) {
	var v byte
	// High nibble
	switch {
	case '0' <= a && a <= '9':
		v = (a - '0') << 4
	case 'a' <= a && a <= 'f':
		v = (a - 'a' + 10) << 4
	case 'A' <= a && a <= 'F':
		v = (a - 'A' + 10) << 4
	default:
		return 0, false
	}
	// Low nibble
	switch {
	case '0' <= b && b <= '9':
		v |= (b - '0')
	case 'a' <= b && b <= 'f':
		v |= (b - 'a' + 10)
	case 'A' <= b && b <= 'F':
		v |= (b - 'A' + 10)
	default:
		return 0, false
	}
	return v, true
}
