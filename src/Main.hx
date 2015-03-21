package ;
import flambeproject.FlambeProject;
import tools.gradle.GradleTool;
import watchers.LocaleWatcher;
import core.HaxeHelper;
import kha.KhaProject;

import core.QuickOpen;
import core.AnnotationRuler;
import core.ProcessHelper;
import core.RecentProjectsList;
import core.Splitter;
import core.WelcomeScreen;
import dialogs.DialogManager;
import jQuery.JQuery;
import autoformat.HaxePrinterLoader;
import cm.Editor;
import cm.Zoom;
import core.CompilationOutput;
import core.Completion;
import core.DragAndDrop;
import core.FileDialog;
import core.HaxeLint;
import core.HaxeParserProvider;
import core.HaxeServer;
import core.Hotkeys;
import core.MenuCommands;
import core.PreserveWindowState;
import core.RunProject;
import core.Utils;
import filetree.FileTree;
import haxe.Timer;
import haxe.Unserializer;
import haxeproject.HaxeProject;
import js.Browser;
import js.html.Element;
import js.html.TextAreaElement;
import js.Node;
import js.node.Walkdir;
import menu.BootstrapMenu;
import newprojectdialog.NewProjectDialog;
import nodejs.webkit.App;
import nodejs.webkit.Window;
import openflproject.OpenFLProject;
import openproject.OpenProject;
import parser.ClasspathWalker;
import pluginloader.PluginManager;
import projectaccess.ProjectAccess;
import projectaccess.ProjectOptions;
import tabmanager.TabManager;
import watchers.SettingsWatcher;
import watchers.SnippetsWatcher;

/**
 * ...
 * @author AS3Boyan
 */

class Main
{
	public static var currentTime:Float;
	public static var window:Window;
    public static var sync:Bool;

	static function main()
	{
		window = Window.get();
		window.showDevTools();
		window.title = "HIDE";

		js.Node.process.on('uncaughtException', function (err)
		{
			trace(err);

			window.show();

			//if (!window.isDevToolsOpen())
			//{

			//}
		}
		);

        sync = true;

		PreserveWindowState.init();

		Browser.window.addEventListener("load", function (e):Void
		{			
			var splitter = Splitter.get();
			splitter.load();

			SettingsWatcher.load();
			
			var snippetsCompletion = SnippetsWatcher.get();
			
			snippetsCompletion.load();
			Utils.prepare();
			Hotkeys.prepare();

			BootstrapMenu.createMenuBar();
			NewProjectDialog.load();
			
			var zoom = Zoom.get();
			zoom.load();
			
			var fileTreeInstance = FileTree.get();
			fileTreeInstance.init();
			
			var projectOptions = ProjectOptions.get();
			projectOptions.create();
			
			DialogManager.load();
			FileDialog.create();
			
			var tabManagerInstance = TabManager.get();
			tabManagerInstance.load();
						
			var classpathWalker = ClasspathWalker.get();
			classpathWalker.load();
			
			HaxeLint.load();
			Editor.load();
			MenuCommands.add();
			
			var completionInstance = Completion.get();
			completionInstance.load();
			
			HaxePrinterLoader.load();

			ProjectAccess.registerSaveOnCloseListener();

			var haxeProject = HaxeProject.get();
			var openFLProject = OpenFLProject.get();
			var flambeProject = FlambeProject.get();
			var khaProject = KhaProject.get();
            khaProject.load();

			CompilationOutput.load();

			var recentProjectsList = RecentProjectsList.get();
			OpenProject.searchForLastProject();
			DragAndDrop.prepare();
			var classWalker = ClasspathWalker.get();
			var welcomeScreen = WelcomeScreen.get();
			welcomeScreen.load();
			
			var quickOpen = QuickOpen.get();

			LocaleWatcher.processHtmlElements();
			
            sync = false;

			currentTime = Date.now().getTime();

			var processHelper = ProcessHelper.get();
			
			var pluginManager = PluginManager.get();
			
			processHelper.checkProcessInstalled("haxe", ["-v"], function (installed:Bool)
			{
				if (installed)
				{
					HaxeServer.check();
					pluginManager.loadPlugins();
				}
				else
				{
					Alertify.error("Haxe compiler is not found");
					pluginManager.loadPlugins(false);
				}
			}
			);

			processHelper.checkProcessInstalled("npm", ["-v"], function (installed:Bool):Void
			{
				trace("npm installed " + Std.string(installed));

				if (installed)
				{
					processHelper.runProcess("npm", ["list", "-g", "flambe"], null, function (stdout:String, stderr:String):Void
					{
						trace("flambe installed " + Std.string(stdout.indexOf("(empty)") == -1));
					}
					, function (code, stdout, stderr):Void
					{
						trace("flambe installed " + Std.string(stdout.indexOf("(empty)") == -1));
					}
					);
				}
			}
			);

			processHelper.checkProcessInstalled("haxelib run lime", [], function (installed:Bool):Void
			{
				trace("lime installed " + Std.string(installed));
			}
			);

            processHelper.checkProcessInstalled("git", ["--version"], function (installed:Bool)
            {
                trace("git installed " + Std.string(installed));
            }
            );

			window.show();
				setupTools();
		}
		);

		window.on("close", function (e)
		{
			App.closeAllWindows();
		}
		);
		
	
	}
	
	static private function setupTools() 
	{
		GradleTool.get().setup();
	}

}
