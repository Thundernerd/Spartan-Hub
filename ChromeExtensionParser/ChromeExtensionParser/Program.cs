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
            if ( jsType.Contains( ' ' ) ) {
                jsType = jsType.Substring( 0, jsType.IndexOf( ' ' ) );
            }

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
                var inst = new Program();
                inst.ReadPage( t );
                //json += GetMethods( t );

                if ( i < urls.Length - 1 ) {
                    json += ",";
                }
            }

            System.IO.File.WriteAllText( "D://chrome.json", "{" + json + "}" );

            //var json = GetMethods( "" );
        }

        private class Node {
            public string Name = "";
            public string Type = "";
            public string Description = "";

            public virtual string ToJson() {
                return "{ }";
            }

            public override string ToString() {
                return string.Format( "{0} - {1}", Name, Description );
            }
        }

        private class ContainerNode : Node {
            public string Permissions = "";

            public List<Node> Types = new List<Node>();
            public List<Node> Properties = new List<Node>();
            public List<MethodNode> Methods = new List<MethodNode>();

        }

        private class EnumNode : Node {
            public List<string> Items = new List<string>();
        }

        private class MethodNode : Node {
            public List<Node> Parameters = new List<Node>();
        }

        private class PropertyNode : Node {
            public List<Node> Properties = new List<Node>();
        }

        private HtmlNode document;

        private HtmlNode GetDocument( string url ) {
            var client = new WebClient();
            var html = client.DownloadString( url );

            var doc = new HtmlDocument();
            doc.LoadHtml( html );

            return doc.DocumentNode;
        }

        private ContainerNode containerNode;

        private void ReadPage( string url ) {
            document = GetDocument( url );
            containerNode = new ContainerNode();

            containerNode.Name = url.Substring( url.LastIndexOf( '/' ) + 1 );

            GetDescription();
            GetPermissions();
            GetTypes();
            GetProperties();
            GetMethods();
            GetEvents();
        }

        private void GetDescription() {
            var labelNode = document.QuerySelector( "#intro td.title" );
            var parent = labelNode.ParentNode;
            var valueNode = parent.QuerySelector( "td:nth-child(2)" );
            var description = valueNode.InnerText.Trim();

            if ( description.Contains( '\n' ) ) {
                var splits = description.Split( '\n' );
                description = "";
                foreach ( var item in splits ) {
                    description += item.Trim();
                    description += " ";
                }
            }

            containerNode.Description = description.Trim();
        }

        private void GetPermissions() {
            var titleNodes = document.QuerySelectorAll( "#intro td.title" );
            HtmlNode permissionNode = null;
            foreach ( var item in titleNodes ) {
                if ( item.InnerText == "Permissions:" ) {
                    permissionNode = item;
                    break;
                }
            }

            if ( permissionNode == null ) return;

            var temp = permissionNode.ParentNode.QuerySelector( "td:nth-child(2)" );
            var value = temp.InnerText.Trim();
            value = value.Remove( 0, value.IndexOf( '"' ) + 1 );
            value = value.Substring( 0, value.IndexOf( '"' ) );

            containerNode.Permissions = value.Trim();
        }

        private void GetTypes() {
            var nodes = document.QuerySelectorAll( "h3[id*=\"type-\"]" );

            foreach ( var item in nodes ) {
                var parent = item.ParentNode;
                var name = item.InnerText.Trim();

                var isEnum = false;
                var propertiesNode = parent.QuerySelector( string.Format( "#{0}-properties", name ) );
                var methodsNode = parent.QuerySelector( string.Format( "#{0}-methods", name ) );
                if ( propertiesNode == null && methodsNode == null ) {
                    var headerNodes = parent.QuerySelectorAll( "th" );
                    foreach ( var header in headerNodes ) {
                        if ( header.InnerText.Trim() == "Enum" ) {
                            isEnum = true;
                            break;
                        }
                    }
                }

                if ( isEnum ) {
                    GetTypeEnum( parent );
                } else if ( propertiesNode != null ) {
                    GetTypeProperty( propertiesNode, name );
                } else if ( methodsNode != null ) {
                    GetTypeMethod( methodsNode );
                }
            }
        }

        private void GetTypeEnum( HtmlNode node ) {
            var enumNode = new EnumNode();

            enumNode.Name = node.QuerySelector( "h3" ).InnerText.Trim();
            var descriptionNode = node.QuerySelector( "dd" );
            enumNode.Description = node.QuerySelector( "dd" ) == null ? "" : node.QuerySelector( "dd" ).InnerText.Trim();
            enumNode.Items = new List<string>();

            var nodes = node.QuerySelectorAll( "code" );
            foreach ( var item in nodes ) {
                enumNode.Items.Add( item.InnerText.Trim( '\"', ' ' ) );
            }

            containerNode.Types.Add( enumNode );
        }

        private void GetTypeProperty( HtmlNode node, string propertyName, bool innerTable = false ) {
            var property = new PropertyNode();
            property.Name = propertyName;

            IEnumerable<HtmlNode> propertyNodes = null;

            if ( !innerTable ) {
                propertyNodes = node.ParentNode.ParentNode.QuerySelectorAll( string.Format( "tr[id*=\"property-{0}-\"]", propertyName ) );
            } else {
                propertyNodes = node.QuerySelectorAll( string.Format( "tr[id*=\"property-{0}-\"]", propertyName ) );
            }

            foreach ( var pNode in propertyNodes ) {
                var propertyItem = new Node();

                var type = ConvertToJSType( pNode.QuerySelector( "td:nth-child(1)" ).InnerText.Trim() );
                var name = pNode.QuerySelector( "td:nth-child(2)" ).InnerText.Trim();

                var descNode = pNode.QuerySelector( "td:nth-child(3)" );
                var table = descNode.QuerySelector( ".innerTable" );

                if ( table != null ) {
                    descNode.RemoveChild( table );
                }

                var description = descNode.InnerText.Trim();

                if ( description.Contains( "Since Chrome" ) ) {
                    var index = description.IndexOf( "Since Chrome" );
                    description = description.Remove( index, description.IndexOf( '.', index ) + 1 ).Trim();
                }

                if ( name.Contains( "(optional)" ) ) {
                    name = name.Replace( "(optional)", "" ).Trim();
                    name += "?";
                }

                if ( table != null ) {
                    var tempName = name.Replace( "?", "" );
                    //var tempLetter = tempName[0].ToString().ToUpper();
                    //tempName = tempName.Remove( 0, 1 );
                    //tempName = tempName.Insert( 0, tempLetter );
                    GetTypeProperty( table, tempName, true );
                    type = "+" + name;
                }

                propertyItem.Type = type;
                propertyItem.Name = name;
                propertyItem.Description = description;

                property.Properties.Add( propertyItem );
            }

            containerNode.Types.Add( property );
        }

        private string ConvertToJSType( string type ) {
            switch ( type ) {
                case "integer":
                case "float":
                case "double":
                    return "number";
                case "boolean":
                case "string":
                case "object":
                    return type;
                default:
                    type = type.Replace( "array of", "" ).Trim();
                    return string.Format( "+chrome.{0}.{1}", containerNode.Name, type );
            }

            //return type;
        }

        private string CleanName( string name ) {
            if ( name.Contains( "(optional)" ) ) {
                name = name.Replace( "(optional)", "" ).Trim();
                name += "?";
            }

            return name;
        }

        private void GetTypeMethod( HtmlNode node ) {

        }

        private void GetProperties() {
            var node = document.QuerySelector( "#properties" );
            if ( node != null ) {
                node = node.NextSibling.NextSibling; // Select the table
                var properties = node.QuerySelectorAll( "tr" );

                foreach ( var item in properties ) {
                    var type = item.QuerySelector( "td:nth-child(1)" ).InnerText.Trim();
                    var name = item.QuerySelector( "td:nth-child(2)" ).InnerText.Trim();
                    var description = item.QuerySelector( "td:nth-child(3)" ).InnerText.Trim();

                    if ( description.Contains( "Deprecated" ) ) continue;

                    if ( description.Contains( "Since Chrome" ) ) {
                        var index = description.IndexOf( "Since Chrome" );
                        description = description.Remove( index, description.IndexOf( '.', index ) + 1 ).Trim();
                    }

                    //var namePrefix = string.Format( "chrome.{0}.", name );
                    var ind = name.LastIndexOf( '.' );
                    if ( ind != -1 ) {
                        name = name.Substring( ind + 1 );
                    }

                    int tempInt = -1;
                    if ( int.TryParse( type, out tempInt ) ) {
                        continue;
                    }

                    var property = new Node();
                    property.Type = ConvertToJSType( type );
                    property.Name = name;
                    property.Description = description;

                    containerNode.Properties.Add( property );
                }
            }
        }

        private void GetMethods() {
            var node = document.QuerySelector( "#methods" );
            if ( node == null ) return;

            var methods = node.ParentNode.QuerySelectorAll( "h3[id*=\"method-\"]" );
            foreach ( var item in methods ) {
                var method = new MethodNode();
                var parent = item.ParentNode;

                var name = item.InnerText.Trim();
                var description = "";

                var descriptionNode = parent.QuerySelector( ".description" );
                if ( descriptionNode.InnerText.Contains( "Deprecated" ) ) continue;

                var table = descriptionNode.QuerySelector( "table" );


                if ( table != null ) {
                    try {
                        descriptionNode.RemoveChild( table );
                    } catch ( ArgumentOutOfRangeException ) {
                        table = null;
                        var temp = descriptionNode.InnerText.Trim();
                        var ind = temp.LastIndexOf( "Returns" );
                        if ( ind != -1 ) {
                            temp = temp.Remove( ind );
                        }
                        description = temp.Trim();
                    }
                }

                if ( string.IsNullOrEmpty( description ) ) {
                    description = descriptionNode.InnerText.Trim();
                }

                if ( table != null ) {
                    var properties = table.QuerySelectorAll( string.Format( "tr[id*=\"property-{0}-\"]", name ) );
                    foreach ( var prop in properties ) {
                        var pType = prop.QuerySelector( "td:nth-child(1)" ).InnerText.Trim();
                        var pName = prop.QuerySelector( "td:nth-child(2)" ).InnerText.Trim();
                        var dNode = prop.QuerySelector( "td:nth-child(3)" );
                        var dTable = dNode.QuerySelector( "table" );

                        if ( dTable != null ) {
                            dNode.RemoveChild( dTable );
                        }

                        var pDescription = dNode.InnerText.Trim();

                        // Don't do this for now
                        //if ( dTable != null ) {
                        //    var innerProperties = dTable.QuerySelectorAll( string.Format( "tr[id*=\"property-{0}-\"]", pName ) );
                        //    foreach ( var ip in innerProperties ) {
                        //        var ipType = ip.QuerySelector( "td:nth-child(1)" ).InnerText.Trim();
                        //        var ipName = ip.QuerySelector( "td:nth-child(2)" ).InnerText.Trim();
                        //        var ipDescription = ip.QuerySelector( "td:nth-child(3)" ).InnerText.Trim();
                        //    }
                        //}

                        var parameter = new Node();
                        parameter.Name = CleanName( pName );
                        parameter.Type = pType;
                        parameter.Description = pDescription;
                        method.Parameters.Add( parameter );
                    }
                }

                method.Name = CleanName( name );
                method.Description = description;
                containerNode.Methods.Add( method );
            }
        }

        private void GetEvents() {
            var node = document.QuerySelector( "#events" );
            if ( node == null ) return;

            var events = node.ParentNode.QuerySelectorAll( "h3[id*=\"event-\"]" );
            foreach ( var item in events ) {
                var descNode = item.ParentNode.QuerySelector( ".description" );

                var name = item.InnerText.Trim();
                var description = descNode.QuerySelector( "p:nth-child(1)" ).InnerText.Trim();

                var table = descNode.QuerySelector( ".innerTable" );
                var parameters = table.QuerySelectorAll( string.Format( "tr[id*=\"property-{0}-\"]", name ) );

                // Skip if we cannot do this
                try { parameters.Count(); } catch ( NullReferenceException ) { continue; }

                foreach ( var param in parameters ) {
                    if ( param.ParentNode.ParentNode.Name != "div" ) continue;
                    //if ( param.ParentNode.Name == "table" && param.ParentNode.Attributes["class"].Value == "innerTable" ) continue;

                    var pType = param.QuerySelector( "td:nth-child(1)" ).InnerText.Trim();
                    var pName = param.QuerySelector( "td:nth-child(2)" ).InnerText.Trim();

                    descNode = param.QuerySelector( "td:nth-child(3)" );
                    table = descNode.QuerySelector( ".innerTable" );

                    // The catch is real
                    IEnumerable<HtmlNode> innerProperties = null;
                    try {
                        innerProperties = table.QuerySelectorAll( string.Format( "tr[id*=\"property-{0}-\"]", pName ) );
                        if ( innerProperties == null || innerProperties.Count() == 0 ) {
                            innerProperties = table.QuerySelectorAll( string.Format( "tr[id*=\"property-{0}-\"]", name ) );
                        }
                    } catch ( NullReferenceException ) {
                        try {
                            innerProperties = table.QuerySelectorAll( string.Format( "tr[id*=\"property-{0}-\"]", name ) );
                            if ( innerProperties == null || innerProperties.Count() == 0 ) continue;
                        } catch ( NullReferenceException ) {
                            continue;
                        }
                    }

                    foreach ( var ip in innerProperties ) {
                        var ipType = ip.QuerySelector( "td:nth-child(1)" ).InnerText.Trim();
                        var ipName = ip.QuerySelector( "td:nth-child(2)" ).InnerText.Trim();
                        var ipDescNode = ip.QuerySelector( "td:nth-child(3)" );
                        var ipDesc = "";

                        if ( ipDescNode != null ) {
                            table = ipDescNode.QuerySelector( ".innerTable" );
                            if ( table != null ) {
                                var iInnerProperties = table.QuerySelectorAll( string.Format( "tr[id*=\"property-{0}-\"]", ipName ) );
                                foreach ( var iip in iInnerProperties ) {
                                    var iipType = iip.QuerySelector( "td:nth-child(1)" ).InnerText.Trim();
                                    var iipName = iip.QuerySelector( "td:nth-child(2)" ).InnerText.Trim();
                                }
                            } else {
                                ipDesc = ipDescNode.InnerText.Trim();
                            }
                        }
                    }
                    //var pretty = descNode.QuerySelector( ".prettyprint" );

                    //if ( table != null ) {
                    //    descNode.RemoveChild( table );
                    //}

                    //if ( pretty != null ) {
                    //    descNode.RemoveChild( pretty );
                    //}

                    //var pDescription = descNode.QuerySelector( "p" ).InnerText.Trim();
                }
            }
        }

        //private static string GetMethods( string url ) {
        //    var builder = new StringBuilder();
        //    builder.AppendFormat( "\"{0}\": ", url.Substring( url.LastIndexOf( '/' ) + 1 ) );
        //    builder.Append( "{" );

        //    var client = new WebClient();
        //    var downloadedString = client.DownloadString( url );

        //    var doc = new HtmlDocument();
        //    doc.LoadHtml( downloadedString );

        //    var root = doc.DocumentNode;
        //    var nodes = root.QuerySelectorAll( "h3[id*=\"method-\"]" );

        //    var methods = new List<Method>();

        //    foreach ( var item in nodes ) {
        //        var parent = item.ParentNode;

        //        var m = new Method();

        //        m.Name = item.InnerText.Trim();
        //        m.Description = parent.QuerySelector( ".description p" ).InnerText.Trim();
        //        m.Description = m.Description.Substring( 0, m.Description.IndexOf( '.' ) ).Replace( "\"", "\\\"" );
        //        //m.Description = m.Description.Substring( 0, m.Description.Length > 250 ? 250 : m.Description.Length ) + "...";

        //        var parameterNodes = parent.QuerySelectorAll( ".description table tr" );
        //        foreach ( var param in parameterNodes ) {
        //            if ( param.ChildNodes.Count == 1 ) continue;
        //            if ( param.ParentNode.HasAttributes ) continue;
        //            //if ( param.ParentNode.Attributes["class"].Value != "" ) continue;

        //            var p = new Parameter();

        //            p.Name = param.QuerySelector( "td:nth-child(2)" ).InnerText.Trim();
        //            p.Type = param.QuerySelector( "td:nth-child(1)" ).InnerText.Trim();

        //            if ( p.Name.IndexOf( '\n' ) != -1 ) {
        //                var splits = p.Name.Split( '\n' );
        //                p.Name = "";
        //                foreach ( var line in splits ) {
        //                    p.Name += line.Trim();
        //                    p.Name += " ";
        //                }
        //                p.Name = p.Name.Trim();
        //            }

        //            m.Parameters.Add( p );
        //        }

        //        methods.Add( m );
        //    }

        //    for ( int i = 0; i < methods.Count; i++ ) {
        //        builder.Append( methods[i].ToJson( url ) );

        //        if ( i < methods.Count - 1 ) {
        //            builder.Append( "," );
        //        }
        //    }

        //    builder.Append( "}" );

        //    return builder.ToString();
        //}
    }
}
