using Fizzler.Systems.HtmlAgilityPack;
using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace ChromeExtensionParser {

    class Method {
        public string Name = "";
        public string Description = "";
        public List<Parameter> Parameters = new List<Parameter>();

        public string ToJson( string url ) {
            var builder = new StringBuilder();

            builder.AppendFormat( "\"{0}\":", Name );
            builder.Append( "{" );

            builder.Append( "\"!type\": \"fn(" );
            for ( int i = 0; i < Parameters.Count; i++ ) {
                builder.Append( Parameters[i].ToJson() );
                if ( i < Parameters.Count - 1 ) {
                    builder.Append( ", " );
                }
            }
            builder.AppendFormat( ")\", " );

            builder.AppendFormat( "\"!url\": \"{0}#method-{1}\",", url, Name );
            builder.AppendFormat( "\"!doc\": \"{0}\"", Description );
            builder.Append( "}" );

            return builder.ToString();
        }
    }

    class Parameter {
        public string Name = "";
        public string Type = "";

        public string ToJson() {
            var jsType = Type;
            var jsName = Name;

            jsType = jsType.Replace( "function", "fn()" );
            jsType = jsType.Replace( "integer", "number" );

            jsName = jsName.Replace( "(optional)", "" );

            return string.Format( "{0}: {1}", jsName.Trim(), jsType.Trim() );
        }
    }

    class Program {

        static string[] urls = {
            "alarms",
            "bookmarks",
            "browserAction",
            "browsingData",
            "commands",
            "contentSettings",
            "contextMenus",
            "cookies",
            "debugger",
            "declarativeContent",
            "downloads",
            "extension",
            "fontSettings",
            "gcm",
            "history",
            "i18n",
            "identity",
            "idle",
            "instanceID",
            "management",
            "notifications",
            "omnibox",
            "pageAction",
            "pageCapture",
            "permissions",
            "platformKeys",
            "power",
            "runtime",
            "sessions",
            "tabCapture",
            "tabs",
            "topSites",
            "tts",
            "webNavigation",
            "webRequest",
            "webstore",
            "windows",
        };

        static void Main( string[] args ) {
            var json = "";
            for ( int i = 0; i < urls.Length; i++ ) {
                Console.WriteLine( "Doing {0}", urls[i] );
                var t = string.Format( "https://developer.chrome.com/extensions/{0}", urls[i] );
                json += GetMethods( t );

                if ( i < urls.Length - 1 ) {
                    json += ",";
                }
            }

            System.IO.File.WriteAllText( "D://chrome.json", "{" + json + "}" );

            //var json = GetMethods( "" );
        }

        private static string GetMethods( string url ) {
            var builder = new StringBuilder();
            builder.AppendFormat( "\"{0}\": ", url.Substring( url.LastIndexOf( '/' ) + 1 ) );
            builder.Append( "{" );

            var client = new WebClient();
            var downloadedString = client.DownloadString( url );

            var doc = new HtmlDocument();
            doc.LoadHtml( downloadedString );

            var root = doc.DocumentNode;
            var nodes = root.QuerySelectorAll( "h3[id*=\"method-\"]" );

            var methods = new List<Method>();

            foreach ( var item in nodes ) {
                var parent = item.ParentNode;

                var m = new Method();

                m.Name = item.InnerText.Trim();
                m.Description = parent.QuerySelector( ".description p" ).InnerText.Trim();
                m.Description = m.Description.Substring( 0, m.Description.IndexOf( '.' ) ).Replace( "\"", "\\\"" );
                //m.Description = m.Description.Substring( 0, m.Description.Length > 250 ? 250 : m.Description.Length ) + "...";

                var parameterNodes = parent.QuerySelectorAll( ".description table tr" );
                foreach ( var param in parameterNodes ) {
                    if ( param.ChildNodes.Count == 1 ) continue;
                    if ( param.ParentNode.HasAttributes ) continue;
                    //if ( param.ParentNode.Attributes["class"].Value != "" ) continue;

                    var p = new Parameter();

                    p.Name = param.QuerySelector( "td:nth-child(2)" ).InnerText.Trim();
                    p.Type = param.QuerySelector( "td:nth-child(1)" ).InnerText.Trim();

                    if ( p.Name.IndexOf( '\n' ) != -1 ) {
                        var splits = p.Name.Split( '\n' );
                        p.Name = "";
                        foreach ( var line in splits ) {
                            p.Name += line.Trim();
                            p.Name += " ";
                        }
                        p.Name = p.Name.Trim();
                    }

                    m.Parameters.Add( p );
                }

                methods.Add( m );
            }

            for ( int i = 0; i < methods.Count; i++ ) {
                builder.Append( methods[i].ToJson( url ) );

                if ( i < methods.Count - 1 ) {
                    builder.Append( "," );
                }
            }

            builder.Append( "}" );

            return builder.ToString();
        }
    }
}
