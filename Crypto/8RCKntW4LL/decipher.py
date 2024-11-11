
def ternary_to_hex(ternary_str):
    # Сначала переведем строку из троичной системы в десятичную
    decimal_value = int(ternary_str, 3)
    
    # Затем переведем десятичное значение в шестнадцатеричное
    hex_value = hex(decimal_value)[2:]  # Убираем префикс '0x'
    result_string = ''.join([chr(int(hex_value[i:i+2], 16)) for i in range(0, len(hex_value), 2)])   # Переводим hex в символы
    
    return result_string


def main():
	ctext = "lII||I|I|l|l|l||II|I||l|ll|lIl|lI||II||I|||l||IIlIIlllII|||II||IIl|IlIIlIlll|lll||l|ll|l||lIlIIlllIII"
	ctext = ctext.replace('|', '0')
	ctext = ctext.replace('I', '1')
	ctext = ctext.replace('l', '2')

	print(ctext)
	print(ternary_to_hex(ctext))

	ctext = "lII||I|I|l|l|l||II|I||l|ll|lIl|lI||II||I|||l||IIlIIlllII|||II||IIl|IlIIlIlll|lll||l|ll|l||lIlIIlllIII"
	ctext = ctext.replace('|', '0')
	ctext = ctext.replace('I', '2')
	ctext = ctext.replace('l', '1')

	print(ctext)
	print(ternary_to_hex(ctext))

	ctext = "lII||I|I|l|l|l||II|I||l|ll|lIl|lI||II||I|||l||IIlIIlllII|||II||IIl|IlIIlIlll|lll||l|ll|l||lIlIIlllIII"
	ctext = ctext.replace('|', '1')
	ctext = ctext.replace('I', '0')
	ctext = ctext.replace('l', '2')

	print(ctext)
	print(ternary_to_hex(ctext))
	
	ctext = "lII||I|I|l|l|l||II|I||l|ll|lIl|lI||II||I|||l||IIlIIlllII|||II||IIl|IlIIlIlll|lll||l|ll|l||lIlIIlllIII"
	ctext = ctext.replace('|', '1')
	ctext = ctext.replace('I', '2')
	ctext = ctext.replace('l', '0')

	print(ctext)
	print(ternary_to_hex(ctext))

	ctext = "lII||I|I|l|l|l||II|I||l|ll|lIl|lI||II||I|||l||IIlIIlllII|||II||IIl|IlIIlIlll|lll||l|ll|l||lIlIIlllIII"
	ctext = ctext.replace('|', '2')
	ctext = ctext.replace('I', '0')
	ctext = ctext.replace('l', '1')

	print(ctext)
	print(ternary_to_hex(ctext))
	
	ctext = "lII||I|I|l|l|l||II|I||l|ll|lIl|lI||II||I|||l||IIlIIlllII|||II||IIl|IlIIlIlll|lll||l|ll|l||lIlIIlllIII"
	ctext = ctext.replace('|', '2')
	ctext = ctext.replace('I', '1')
	ctext = ctext.replace('l', '0')

	print(ctext)
	print(ternary_to_hex(ctext))

if __name__ == '__main__':
	main()