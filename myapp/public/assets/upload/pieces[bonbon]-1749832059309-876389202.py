from typing import Generator

Interpretation = dict[str, bool]


def decomp(n: int, nb_bits: int):
    List = []
    reste = 0
    for _ in range(0, nb_bits):
        List.append(n % 2 != 0)
        n = n // 2

    return List


def interpretation(voc: list[str], vals: list[bool]) -> Interpretation:
    Dic = {}
    indice = 0
    for valeur in voc:
        Dic[valeur] = vals[indice]
        indice = indice + 1
    return Dic


def gen_interpretations(voc: list[str]) -> Generator[dict[str, bool], None, None]:
    donnee = []
    for valeur in range(2 ** len(voc)):
        donnee = decomp(valeur, len(voc))
        yield interpretation(voc, donnee)

def valuate (formula: str, interpretation : dict[str, bool]) -> bool:
    return eval(formula,interpretation)


def table_de_verite (formule : str, vocab : list[str]) -> list[bool]:
    table_verite = []
    resultat = True
    print(f"formule : {formule}")

    for i in gen_interpretations(vocab):
        resultat= valuate(formule,i)

        #for variable in vocab:
         #   print(f"{i[variable]}|\t")

        #print(f"{resultat}|")

        table_verite.append(resultat)
        #print(f"{i}--> {valuate(formule,i)}")
    return table_verite


def valide ( formule : str, vocab: list[str]) -> bool:
    for resultat in table_de_verite(formule,vocab):
        if resultat== False:
            return False
    return True

def contradictoire(formule : str, vocab: list[str]) -> bool:
    for resultat in table_de_verite(formule,vocab):
        if resultat== True:
            return False
    return True

def contingent(formule : str, vocab: list[str]) -> bool:
    memoire = False
    for resultat in table_de_verite(formule,vocab):
        if resultat== True:
            if memoire == False:
                memoire = True
            else:
                return True
    return False

def main():
    # print(decomp(10,4))
    # print(interpretation(["A", "B", "C"],[True, True, False]))
    #for i in gen_interpretations(["toto", "tutu"]):
    #    print(i)
    #print(valuate("(A or B) and not(C)", {"A": True, "B": False, "C": False}))
    #table_de_verite("(A or B) and not(C)",["A","B","C"])

    voc = [f"x{i}" for i in range (20)]
    print(valide("x1 or not(x1)",voc))
    

if __name__ == "__main__":
    main()
