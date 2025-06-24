import Link from "next/link"
import { Phone, MapPin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Rio Porto P2P</h3>
            <p className="text-sm text-muted-foreground">
              RIO PORTO MEDIAÇÃO LTDA
            </p>
            <p className="text-sm text-muted-foreground">
              CNPJ: 11.741.563/0001-57
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/servicos" className="text-sm text-muted-foreground hover:text-primary">
                  Nossos Serviços
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/cursos" className="text-sm text-muted-foreground hover:text-primary">
                  Cursos
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-sm text-muted-foreground hover:text-primary">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Serviços</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Compra e Venda P2P</li>
              <li className="text-sm text-muted-foreground">Consultoria Bitcoin</li>
              <li className="text-sm text-muted-foreground">Segurança Digital</li>
              <li className="text-sm text-muted-foreground">Mineração BTC</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                +55 21 3400-3259
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>
                  Av. Marechal Câmara, 160<br />
                  Sala 1107, Centro<br />
                  Rio de Janeiro - RJ<br />
                  CEP: 20020-907
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                contato@rioporto.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Rio Porto P2P. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}