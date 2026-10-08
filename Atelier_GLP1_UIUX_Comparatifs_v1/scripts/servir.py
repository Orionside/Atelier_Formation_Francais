"""Serveur local de l'atelier, avec lecture partielle des MP4/MP3 pour les extraits."""
import argparse,http.server,re,socketserver
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent.parent
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*args,**kw):super().__init__(*args,directory=str(ROOT),**kw)
    def send_head(self):
        self.remaining=None
        p=Path(self.translate_path(self.path))
        header=self.headers.get('Range')
        if not header or not p.is_file():return super().send_head()
        m=re.fullmatch(r'bytes=(\d*)-(\d*)',header)
        if not m:return super().send_head()
        size=p.stat().st_size
        start=int(m[1]) if m[1] else max(0,size-int(m[2]))
        end=min(int(m[2]) if m[2] and m[1] else size-1,size-1)
        if start>=size or end<start:
            self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.end_headers();return None
        f=p.open('rb');f.seek(start);self.remaining=end-start+1
        self.send_response(206);self.send_header('Content-Type',self.guess_type(str(p)))
        self.send_header('Accept-Ranges','bytes');self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length',str(self.remaining));self.end_headers();return f
    def end_headers(self):
        self.send_header('Accept-Ranges','bytes');self.send_header('Cache-Control','no-cache');super().end_headers()
    def copyfile(self,source,outputfile):
        if self.remaining is None:return super().copyfile(source,outputfile)
        try:
            while self.remaining:
                chunk=source.read(min(64*1024,self.remaining))
                if not chunk:break
                outputfile.write(chunk);self.remaining-=len(chunk)
        except (BrokenPipeError,ConnectionResetError):pass
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8769);args=parser.parse_args()
    with http.server.ThreadingHTTPServer(('127.0.0.1',args.port),Handler) as server:
        print(f'Atelier : http://127.0.0.1:{args.port}/',flush=True);server.serve_forever()
